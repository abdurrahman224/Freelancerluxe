import React, { useState, useEffect } from 'react';
import { Search, Plus, ChevronLeft, ChevronRight, Trash, PencilLine, Loader } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Avatar from './components/Avatar';
import TeamBadge from './components/TeamBadge';
import PlayerModal from './components/PlayerModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import { usePlayers } from '../../../hooks/usePlayers';

const TEAMS = [
  'Los Angeles Lakers',
  'Golden State Warriors',
  'Chicago Bulls',
  'Boston Celtics',
  'Miami Heat',
  'Milwaukee Bucks',
  'Phoenix Suns',
  'LA Clippers',
  'Denver Nuggets',
  'Memphis Grizzlies',
  'Minnesota Timberwolves',
  'Cleveland Cavaliers',
  'New Orleans Pelicans',
];

const PER_PAGE = 100;
const EMPTY = {
  name: '',
  team: TEAMS[0],
  position: '',
  bio: '',
  era: '',
  difficulty: 'Medium',
  imageUrl: '',
};

const Management = () => {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const {
    players,
    loading,
    error,
    pagination,
    handleAdd,
    handleEdit,
    handleDelete,
    handleBulkDelete,
    setError,
  } = usePlayers(page, PER_PAGE);
  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEdit] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selected, setSelected] = useState([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  // Show error toast when error changes
  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: 'top-right',
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setError(null);
    }
  }, [error, setError]);

  // Filter players on client side (for search functionality)
  const filtered = query.trim()
    ? players.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.team.toLowerCase().includes(query.toLowerCase())
      )
    : players;

  // Use API pagination data
  const totalPages = query.trim()
    ? Math.max(1, Math.ceil(filtered.length / PER_PAGE))
    : pagination.totalPages;
  const paged = query.trim() ? filtered : players;

  const onAdd = async (form) => {
    const success = await handleAdd(form);
    if (success) {
      setAddOpen(false);
      toast.success('Player added successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const onEdit = async (form) => {
    const success = await handleEdit(form, editTarget);
    if (success) {
      setEdit(null);
      toast.success('Player updated successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    const success = await handleDelete(deleteTarget.id);
    if (success) {
      toast.success('Player deleted successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    setDeleteTarget(null);
  };

  const handleBulkDeleteConfirm = async () => {
    const success = await handleBulkDelete(selected);
    if (success) {
      toast.success(
        `${selected.length} player${selected.length !== 1 ? 's' : ''} deleted successfully!`,
        {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      setSelected([]);
    }
    setBulkDeleteOpen(false);
  };

  const isAllSelected = paged.length > 0 && paged.every((p) => selected.includes(p.id));
  const isIndeterminate = paged.some((p) => selected.includes(p.id)) && !isAllSelected;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelected((prev) => prev.filter((id) => !paged.map((p) => p.id).includes(id)));
    } else {
      setSelected((prev) => [...new Set([...prev, ...paged.map((p) => p.id)])]);
    }
  };

  const toggleSelect = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  if (loading) {
    return (
      <div
        style={{ fontFamily: 'var(--font-primary)' }}
        className="flex h-96 items-center justify-center"
      >
        <Loader size={40} className="animate-spin text-[#ff6b2d]" />
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'var(--font-primary)' }}>
      <h2
        className="mb-1 text-3xl font-bold text-[#111827]"
        style={{ fontFamily: 'var(--font-primary)' }}
      >
        NBA Player Management
      </h2>
      <p className="mb-6 text-base text-[#6b7280] sm:text-lg">
        Search, edit and maintain the trivia player database.
      </p>

      <ToastContainer theme="light" />

      {/* Toolbar */}
      <div className="mb-5 flex gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute top-1/2 left-3 -translate-y-1/2 text-[#564a45]" />
          <input
            className="w-full rounded-lg border border-[#564a45]/42 bg-[#fff8f5] py-2.5 pr-4 pl-9 text-sm focus:ring-2 focus:ring-[#ff6b2d]/30 focus:outline-none"
            placeholder="Search by name, team"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value.trim()) {
                setPage(1);
              }
            }}
          />
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-[#ff6b2d] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#e05520]"
        >
          <Plus size={15} /> Add New Player
        </button>
      </div>

      {/* Bulk action bar */}
      {selected.length > 0 && (
        <div className="mb-4 flex items-center justify-between rounded-xl border border-[#ff6b2d]/30 bg-[#fff1eb] px-5 py-3">
          <span className="text-sm font-medium text-[#374151]">
            <span className="font-bold text-[#ff6b2d]">{selected.length}</span> player
            {selected.length !== 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelected([])}
              className="text-sm text-[#6b7280] transition-colors hover:text-[#374151]"
            >
              Deselect all
            </button>
            <button
              onClick={() => setBulkDeleteOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
            >
              <Trash size={14} /> Delete {selected.length} player{selected.length !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
      )}

      {/* Table — lg and up, horizontally scrollable if tight */}
      <div className="hidden overflow-x-auto rounded-2xl bg-[#f6eeeb] lg:block">
        <table className="w-full min-w-200 table-fixed text-sm">
          <thead>
            <tr className="border-b border-[#d2c9c6]/46">
              <th className="w-10 border-r border-[#d2c9c6]/46 px-4 py-3">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = isIndeterminate;
                  }}
                  onChange={toggleSelectAll}
                  className="h-4 w-4 cursor-pointer accent-[#ff6b2d]"
                />
              </th>
              <th
                className="w-1/4 border-r border-[#d2c9c6]/46 px-5 py-3 text-left text-base font-semibold text-[#140601] lg:text-lg"
                style={{
                  fontFamily: 'var(--font-secondary)',
                }}
              >
                Player Info
              </th>
              <th
                className="w-1/4 border-r border-[#d2c9c6]/46 px-5 py-3 text-left text-base font-semibold text-[#140601] lg:text-lg"
                style={{
                  fontFamily: 'var(--font-secondary)',
                }}
              >
                Team
              </th>
              <th
                className="w-1/4 border-r border-[#d2c9c6]/46 px-5 py-3 text-left text-base font-semibold text-[#140601] lg:text-lg"
                style={{
                  fontFamily: 'var(--font-secondary)',
                }}
              >
                Bio
              </th>
              <th
                className="w-1/4 px-5 py-3 text-left text-base font-semibold text-[#140601] lg:text-lg"
                style={{
                  fontFamily: 'var(--font-secondary)',
                }}
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {paged.map((p) => (
              <tr
                key={p.id}
                className={`border-b border-[#d2c9c6]/46 transition-colors ${selected.includes(p.id) ? 'bg-[#fff1eb]' : ''}`}
              >
                <td className="w-10 border-r border-[#d2c9c6]/46 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(p.id)}
                    onChange={() => toggleSelect(p.id)}
                    className="h-4 w-4 cursor-pointer accent-[#ff6b2d]"
                  />
                </td>
                <td className="w-1/4 border-r border-[#d2c9c6]/46 px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar player={p} />
                    <div>
                      <div className="text-base font-semibold text-[#140601]">{p.name}</div>
                      <div className="text-xs text-[#140601]/72">Added {p.added}</div>
                    </div>
                  </div>
                </td>
                <td className="w-1/4 border-r border-[#d2c9c6]/46 px-5 py-3">
                  <TeamBadge team={p.team} />
                </td>
                <td className="w-1/4 truncate border-r border-[#d2c9c6]/46 px-5 py-3 text-base text-[#140601]">
                  {p.bio || '-'}
                </td>
                <td className="w-1/4 px-5 py-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setEdit(p)}
                      className="text-[#140601] hover:text-[#374151]"
                    >
                      <PencilLine size={20} />
                    </button>
                    <button onClick={() => setDeleteTarget(p)} className="text-[#ef4444]">
                      <Trash size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards — mobile / sm only */}
      <div className="space-y-3 lg:hidden">
        {paged.map((p) => (
          <div
            key={p.id}
            className={`flex flex-col gap-3 rounded-2xl p-4 transition-colors ${
              selected.includes(p.id) ? 'border border-[#ff6b2d]/30 bg-[#fff1eb]' : 'bg-[#f6eeeb]'
            }`}
          >
            {/* Top row: checkbox + avatar + name + actions */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selected.includes(p.id)}
                  onChange={() => toggleSelect(p.id)}
                  className="h-4 w-4 shrink-0 cursor-pointer accent-[#ff6b2d]"
                />
                <Avatar player={p} />
                <div>
                  <div className="text-base font-semibold text-[#140601]">{p.name}</div>
                  <div className="text-xs text-[#140601]/60">Added {p.added}</div>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <button onClick={() => setEdit(p)} className="text-[#140601] hover:text-[#374151]">
                  <PencilLine size={18} />
                </button>
                <button onClick={() => setDeleteTarget(p)} className="text-[#ef4444]">
                  <Trash size={18} />
                </button>
              </div>
            </div>
            {/* Team badge */}
            <div>
              <TeamBadge team={p.team} />
            </div>
            {/* Bio */}
            {p.bio && <p className="line-clamp-2 text-sm text-[#140601]/80">{p.bio}</p>}
          </div>
        ))}
      </div>

      {/* Pagination (separate from table container) */}
      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Total count info */}
        <div className="py-2 text-sm sm:text-sm text-[#6b7280]">
          {query.trim() ? (
            <span>
              Showing <span className="font-semibold text-[#374151]">{filtered.length}</span> result
              {filtered.length !== 1 ? 's' : ''} from search
            </span>
          ) : (
            <span>
              Showing{' '}
              <span className="font-semibold text-[#374151]">
                {(page - 1) * PER_PAGE + 1}-{Math.min(page * PER_PAGE, pagination.totalPlayers)}
              </span>{' '}
              of <span className="font-semibold text-[#374151]">{pagination.totalPlayers}</span>{' '}
              players
            </span>
          )}
        </div>

        {/* Right: Pagination buttons */}
        <div className="flex items-center justify-center gap-1 sm:gap-1.5 overflow-x-auto py-2 sm:py-4 pr-0 sm:pr-6">
          <button
            onClick={() => setPage((n) => Math.max(1, n - 1))}
            disabled={page === 1}
            className="shrink-0 rounded-lg p-1 sm:p-1.5 text-[#9ca3af] hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={15} />
          </button>
          {(() => {
            const pages = [];
            const showEllipsisStart = page > 3;
            const showEllipsisEnd = page < totalPages - 2;

            // Always show first page
            pages.push(
              <button
                key={1}
                onClick={() => setPage(1)}
                className={`shrink-0 h-6 w-6 sm:h-7 sm:w-7 rounded-lg text-xs font-medium ${
                  page === 1 ? 'bg-[#ff6b2d] text-white' : 'text-[#374151] hover:bg-gray-100'
                }`}
              >
                1
              </button>
            );

            // Show ellipsis or page 2
            if (showEllipsisStart) {
              pages.push(
                <span key="ellipsis-start" className="px-0.5 sm:px-1 text-[#9ca3af] text-xs">
                  ...
                </span>
              );
            } else if (totalPages > 1) {
              pages.push(
                <button
                  key={2}
                  onClick={() => setPage(2)}
                  className={`shrink-0 h-6 w-6 sm:h-7 sm:w-7 rounded-lg text-xs font-medium ${
                    page === 2 ? 'bg-[#ff6b2d] text-white' : 'text-[#374151] hover:bg-gray-100'
                  }`}
                >
                  2
                </button>
              );
            }

            // Show current page and surrounding pages
            const startPage = Math.max(2, page - 1);
            const endPage = Math.min(totalPages - 1, page + 1);

            for (let i = startPage; i <= endPage; i++) {
              if (i === 1 || i === totalPages) continue; // Skip first and last as they're always shown
              if (!showEllipsisStart && i === 2) continue; // Skip 2 if already shown
              if (!showEllipsisEnd && i === totalPages - 1) continue; // Skip second-to-last if will be shown

              pages.push(
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`shrink-0 h-6 w-6 sm:h-7 sm:w-7 rounded-lg text-xs font-medium ${
                    page === i ? 'bg-[#ff6b2d] text-white' : 'text-[#374151] hover:bg-gray-100'
                  }`}
                >
                  {i}
                </button>
              );
            }

            // Show ellipsis or second-to-last page
            if (showEllipsisEnd) {
              pages.push(
                <span key="ellipsis-end" className="px-0.5 sm:px-1 text-[#9ca3af] text-xs">
                  ...
                </span>
              );
            } else if (totalPages > 2) {
              pages.push(
                <button
                  key={totalPages - 1}
                  onClick={() => setPage(totalPages - 1)}
                  className={`shrink-0 h-6 w-6 sm:h-7 sm:w-7 rounded-lg text-xs font-medium ${
                    page === totalPages - 1
                      ? 'bg-[#ff6b2d] text-white'
                      : 'text-[#374151] hover:bg-gray-100'
                  }`}
                >
                  {totalPages - 1}
                </button>
              );
            }

            // Always show last page (if more than 1 page)
            if (totalPages > 1) {
              pages.push(
                <button
                  key={totalPages}
                  onClick={() => setPage(totalPages)}
                  className={`shrink-0 h-6 w-6 sm:h-7 sm:w-7 rounded-lg text-xs font-medium ${
                    page === totalPages
                      ? 'bg-[#ff6b2d] text-white'
                      : 'text-[#374151] hover:bg-gray-100'
                  }`}
                >
                  {totalPages}
                </button>
              );
            }

            return pages;
          })()}
          <button
            onClick={() => setPage((n) => Math.min(totalPages, n + 1))}
            disabled={page === totalPages}
            className="shrink-0 rounded-lg p-1 sm:p-1.5 text-[#9ca3af] hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {addOpen && (
        <PlayerModal
          title="Add New Player"
          initial={EMPTY}
          teams={TEAMS}
          onSave={onAdd}
          onClose={() => setAddOpen(false)}
        />
      )}
      {editTarget && (
        <PlayerModal
          title="Edit Player"
          initial={{
            name: editTarget.name,
            team: editTarget.team,
            position: editTarget.position || '',
            bio: editTarget.bio,
            imageUrl: editTarget.image || '',
            era: editTarget.added || '',
            difficulty: editTarget.difficulty || 'Medium',
          }}
          teams={TEAMS}
          onSave={onEdit}
          onClose={() => setEdit(null)}
        />
      )}
      {deleteTarget && (
        <DeleteConfirmModal
          playerName={deleteTarget.name}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      {bulkDeleteOpen && (
        <DeleteConfirmModal
          playerName={`${selected.length} selected player${selected.length !== 1 ? 's' : ''}`}
          onConfirm={handleBulkDeleteConfirm}
          onCancel={() => setBulkDeleteOpen(false)}
        />
      )}
    </div>
  );
};

export default Management;
