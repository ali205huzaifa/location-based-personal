import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import NoteAPI from "../../api/notesApi/NotesAPI";
import ClipLoader from "react-spinners/ClipLoader";

interface NotesSectionProps {
  userId: string;
}

const NotesSection: React.FC<NotesSectionProps> = ({ userId }) => {
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState<any[]>([]);
  const [editNoteId, setEditNoteId] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await NoteAPI.getAll({ userId });
      const data = Array.isArray(res.data?.data) ? res.data.data : [];
      setNotes(data);
    } catch {
      Swal.fire({
        title: "Error",
        text: "Failed to fetch notes",
        icon: "error",
        confirmButtonColor: "#16968F",
      });
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [userId]);

  const handleSaveNote = async () => {
    if (!content.trim()) {
      Swal.fire({
        toast: true,
        position: "top-right",
        icon: "error",
        title: "Note content is empty!",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      return;
    }
    try {
      setLoading(true);
      await NoteAPI.CreateNote({ content });
      Swal.fire({
        title: "Added",
        text: "Note added successfully!",
        icon: "success",
        confirmButtonColor: "#16968F",
      });
      setContent("");
      await fetchNotes();
    } catch {
      Swal.fire({
        title: "Error",
        text: "Failed to save note!",
        icon: "error",
        confirmButtonColor: "#16968F",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (noteId: string) => {
    try {
      const res = await NoteAPI.GetNoteById(noteId);
      const note = res.data;
      if (note) {
        Swal.fire({
          title: "Note",
          html: note.content,
          confirmButtonText: "Close",
          confirmButtonColor: "#16968F",
        });
      } else {
        Swal.fire({
          title: "Not found",
          text: "Note not found",
          icon: "info",
          confirmButtonColor: "#16968F",
        });
      }
    } catch {
      Swal.fire({
        title: "Error",
        text: "Failed to Fetch note!",
        icon: "error",
        confirmButtonColor: "#16968F",
      });
    }
  };

  const handleEdit = async (noteId: string) => {
    try {
      const res = await NoteAPI.GetNoteById(noteId);
      const note = res.data;
      if (note) {
        setEditNoteId(note._id);
        setEditContent(note.content);
        setIsEditModalOpen(true);
      } else {
        Swal.fire({
          title: "Not found",
          text: "Note not found",
          icon: "info",
          confirmButtonColor: "#16968F",
        });
      }
    } catch {
      Swal.fire({
        title: "Error",
        text: "Failed to Fetch note!",
        icon: "error",
        confirmButtonColor: "#16968F",
      });
    }
  };

  const handleUpdateNote = async () => {
    if (!editContent.trim()) {
      Swal.fire({
        toast: true,
        position: "top-right",
        icon: "error",
        title: "Note content is empty!",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }
    try {
      setLoading(true);
      await NoteAPI.UpdateNote(editNoteId!, { content: editContent });
      Swal.fire("Updated", "Note updated successfully!", "success");
      setIsEditModalOpen(false);
      setEditNoteId(null);
      setEditContent("");
      await fetchNotes();
    } catch {
      Swal.fire({
        title: "Error",
        text: "Failed to delete note",
        icon: "error",
        confirmButtonColor: "#16968F",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (noteId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This note will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#16968F",
      cancelButtonColor: "#d33",
    });
    if (result.isConfirmed) {
      try {
        setLoading(true);
        await NoteAPI.DeleteNote(noteId);
        Swal.fire({
          title: "Deleted",
          text: "Note deleted successfully!",
          icon: "success",
          confirmButtonColor: "#16968F",
        });
        await fetchNotes();
      } catch {
        Swal.fire({
          title: "Error",
          text: "Failed to delete note",
          icon: "error",
          confirmButtonColor: "#16968F",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="mt-6 relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-50">
          <ClipLoader size={50} color="#16968F" />
        </div>
      )}

      <h2 className="text-[19.5px] mb-2">Notes</h2>

      <div className="rounded bg-white mb-3">
        <textarea
          aria-label="Note content"
          className="h-[250px] w-full resize-none rounded border border-gray-200 p-3 focus:outline-none"
          placeholder="Type your note"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSaveNote}
          disabled={loading}
          className="px-12 py-3 bg-[#16968F] text-white hover:bg-teal-700 disabled:opacity-50 rounded-lg"
        >
          Add a Note
        </button>
      </div>
      <div className="h-[380px] overflow-y-auto pr-2 mt-4">
        {notes.map((note) => {
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = note.content;
          const plainText = tempDiv.textContent || tempDiv.innerText || "";

          const isTruncated = plainText.length > 60;
          const visibleText = plainText.substring(0, 60);

          return (
            <div
              key={note._id}
              className="flex items-start justify-between border-b py-4 relative"
            >
              <div className="flex items-start gap-4 text-sm text-[#737373]">
                <img
                  src="/icons/note-icon.svg"
                  alt="comment"
                  className="w-6 h-6"
                />
                <div>
                  {visibleText}
                  {isTruncated && (
                    <>
                      <span>...</span>
                      <span
                        onClick={() => handleView(note._id)}
                        style={{
                          color: "#16968F",
                          cursor: "pointer",
                          textDecoration: "underline",
                          marginLeft: "4px",
                        }}
                      >
                        see more
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs text-[#737373] whitespace-nowrap">
                  {new Date(note.createdAt).toLocaleDateString()}
                </span>
                <button title="Edit" onClick={() => handleEdit(note._id)}>
                  <img
                    src="/icons/edit-icon.svg"
                    alt="edit"
                    className="w-4 h-4"
                  />
                </button>
                <button title="Delete" onClick={() => handleDelete(note._id)}>
                  <img
                    src="/icons/delete-icon.svg"
                    alt="delete"
                    className="w-4 h-4"
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg w-[700px] h-[400px] p-4 relative">
            <h3 className="text-lg font-semibold mb-3">Edit Note</h3>
            <textarea
              aria-label="Note content"
              className="h-[250px] w-full resize-none rounded border border-gray-200 p-3 focus:outline-none"
              placeholder="Type your note"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-black rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateNote}
                disabled={loading}
                className="px-4 py-2 bg-[#16968F] text-white rounded hover:bg-teal-700 disabled:opacity-50"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default NotesSection;
