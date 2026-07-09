import { useState, useEffect } from 'react';
import { GET, POST, PUT, DELETE } from '../services/httpMethods';
import { ENDPOINT } from '../services/httpEndpoint';

// Map UI difficulty strings to API format (uppercase)
const uiToAPIDifficulty = (uiDifficulty) => {
  const map = { Easy: 'EASY', Medium: 'MEDIUM', Hard: 'HARD' };
  return map[uiDifficulty] || uiDifficulty;
};

// Map API difficulty strings back to UI format
const apiToUIDifficulty = (apiDifficulty) => {
  const map = {
    EASY: 'Easy',
    MEDIUM: 'Medium',
    HARD: 'Hard',
    VERY_HARD: 'Very Hard',
    LEGENDARY: 'Legendary',
  };
  return map[apiDifficulty] || 'Medium';
};

export const usePlayers = (page = 1, limit = 10) => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPlayers: 0,
    limit: 10,
  });

  // Fetch players when page or limit changes
  useEffect(() => {
    fetchPlayers(page, limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  const fetchPlayers = async (currentPage = page, currentLimit = limit) => {
    try {
      setLoading(true);
      setError(null);
      const response = await GET(
        `${ENDPOINT.PLAYERS.LIST}?page=${currentPage}&limit=${currentLimit}`
      );

      // Handle API response structure
      const playersData =
        response.data?.data?.players || response.data?.players || response.data?.data || [];

      // Extract pagination info from response
      const paginationData = response.data?.data?.pagination || response.data?.pagination || {};

      // Map API fields to component fields
      const mappedPlayers = (Array.isArray(playersData) ? playersData : []).map((p) => ({
        id: p.id,
        name: p.firstName && p.lastName ? `${p.firstName} ${p.lastName}` : p.name || 'Unknown',
        team: p.team || 'Unknown Team',
        bio: p.biography || '',
        position: p.position || '',
        image: p.image || null,
        added: p.era || p.added || new Date().toLocaleDateString(),
        difficulty: apiToUIDifficulty(p.difficulty),
      }));

      setPlayers(mappedPlayers);
      setPagination({
        currentPage: paginationData.currentPage || currentPage,
        totalPages:
          paginationData.totalPages ||
          Math.ceil((paginationData.total || mappedPlayers.length) / currentLimit),
        totalPlayers: paginationData.total || mappedPlayers.length,
        limit: currentLimit,
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch players');
      console.error('Error fetching players:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (form) => {
    try {
      // Validate required fields
      if (!form.name || !form.name.trim()) {
        setError('Player name is required');
        return false;
      }
      if (!form.team) {
        setError('Team is required');
        return false;
      }

      // Map form fields to API format
      const nameParts = form.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Validate name parts meet API requirements
      if (nameParts.length < 2) {
        setError('Please enter both first and last name');
        return false;
      }
      if (firstName.length < 2 || lastName.length < 2) {
        setError('First and last name must be at least 2 characters each');
        return false;
      }

      const payload = {
        firstName: firstName || '',
        lastName: lastName || '',
        team: form.team || '',
        position: form.position || '',
        biography: form.bio || '',
        image: form.imageUrl && form.imageUrl.trim() ? form.imageUrl.trim() : '',
        era: form.era || '',
        difficulty: uiToAPIDifficulty(form.difficulty),
      };

      console.log('Sending payload:', payload);
      const response = await POST(ENDPOINT.PLAYERS.CREATE, payload);
      const newPlayerData = response.data?.data || response.data;

      if (!newPlayerData || !newPlayerData.id) {
        throw new Error('Invalid response from server');
      }

      // Refresh the current page to get updated data
      await fetchPlayers(page, pagination.limit);
      setError(null);
      return true;
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to add player';
      setError('Error: ' + errorMsg);
      console.error('Error adding player:', err.response?.data || err);
      return false;
    }
  };

  const handleEdit = async (form, editTarget) => {
    try {
      // Validate required fields
      if (!form.name || !form.name.trim()) {
        setError('Player name is required');
        return false;
      }
      if (!form.team) {
        setError('Team is required');
        return false;
      }

      // Map form fields to API format
      const nameParts = form.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Validate name parts meet API requirements
      if (nameParts.length < 2) {
        setError('Please enter both first and last name');
        return false;
      }
      if (firstName.length < 2 || lastName.length < 2) {
        setError('First and last name must be at least 2 characters each');
        return false;
      }

      const payload = {
        firstName: firstName || '',
        lastName: lastName || '',
        team: form.team || '',
        position: form.position || '',
        biography: form.bio || '',
        image: form.imageUrl && form.imageUrl.trim() ? form.imageUrl.trim() : '',
        era: form.era || editTarget.added || '',
        difficulty: uiToAPIDifficulty(form.difficulty),
      };

      console.log('Sending update payload:', payload);
      await PUT(ENDPOINT.PLAYERS.UPDATE(editTarget.id), payload);

      // Refresh the current page to get updated data
      await fetchPlayers(page, pagination.limit);
      setError(null);
      return true;
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to update player';
      setError('Error: ' + errorMsg);
      console.error('Error updating player:', err.response?.data || err);
      return false;
    }
  };

  const handleDelete = async (id) => {
    try {
      await DELETE(ENDPOINT.PLAYERS.DELETE(id));
      // Refresh the current page to get updated data
      await fetchPlayers(page, pagination.limit);
      setError(null);
      return true;
    } catch (err) {
      setError('Failed to delete player');
      console.error('Error deleting player:', err);
      return false;
    }
  };

  const handleBulkDelete = async (ids) => {
    try {
      await POST(ENDPOINT.PLAYERS.BULK_DELETE, { playerIds: ids });
      await fetchPlayers(page, pagination.limit);
      setError(null);
      return true;
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || 'Failed to bulk delete players';
      setError('Error: ' + errorMsg);
      console.error('Error bulk deleting players:', err);
      return false;
    }
  };

  return {
    players,
    loading,
    error,
    setError,
    pagination,
    fetchPlayers,
    handleAdd,
    handleEdit,
    handleDelete,
    handleBulkDelete,
  };
};
