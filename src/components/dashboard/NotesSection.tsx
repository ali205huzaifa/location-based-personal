import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import NoteAPI from "../../api/notesApi/NotesAPI";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module-react";
import ClipLoader from "react-spinners/ClipLoader";
import { motion } from "framer-motion";

Quill.register("modules/imageResize", ImageResize);
const FontWeightStyle = Quill.import("attributors/style/font");
FontWeightStyle.whitelist = ["normal", "medium", "semibold", "bold"];
Quill.register(FontWeightStyle, true);

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
        title: "Error",
        text: "Note content is empty!",
        icon: "error",
        confirmButtonColor: "#16968F",
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
        title: "Error",
        text: "Note content is empty",
        icon: "error",
        confirmButtonColor: "#16968F",
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

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      [{ font: [] }],
      [{ color: [] }, { background: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ script: "sub" }, { script: "super" }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["blockquote", "code-block"],
      ["link", "image", "video"],
      ["clean"],
    ],
    imageResize: {
      parchment: Quill.import("parchment"),
    },
  };

  const quillFormats = [
    "header",
    "font",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "color",
    "background",
    "code-block",
    "align",
    "script",
  ];

  return (
    <div className="mt-6 relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-50">
          <ClipLoader size={50} color="#16968F" />
        </div>
      )}

      <h2 className="text-lg font-semibold mb-2">Notes</h2>

      <div className="rounded bg-white mb-3">
        <ReactQuill
          theme="snow"
          className="h-[250px] w-full"
          value={content}
          onChange={setContent}
          modules={quillModules}
          formats={quillFormats}
        />
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleSaveNote}
          disabled={loading}
          className="px-6 py-2 bg-[#16968F] text-white rounded hover:bg-teal-700 mt-20 disabled:opacity-50"
        >
          Add a Note
        </button>
      </div>

      <div className="h-[380px] overflow-y-auto pr-2 mt-4">
        {notes.map((note, i) => {
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = note.content;
          const plainText = tempDiv.textContent || tempDiv.innerText || "";

          const isTruncated = plainText.length > 45;
          const visibleText = plainText.substring(0, 45);

          return (
            <motion.div
              key={note._id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.05 }}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
              className="border rounded p-3 mb-3 bg-white shadow-sm relative"
            >
              <div className="text-sm mb-2 flex justify-between items-center">
                <div>
                  {visibleText}
                  {isTruncated && (
                    <span
                      onClick={() => handleView(note._id)}
                      style={{
                        color: "#16968F",
                        cursor: "pointer",
                      }}
                    >
                      {" "}
                      ...see more
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500 whitespace-nowrap mr-20">
                  {new Date(note.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="absolute top-3 right-3 flex gap-4">
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
            </motion.div>
          );
        })}
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg w-[700px] h-[450px] p-4 relative">
            <h3 className="text-lg font-semibold mb-3">Edit Note</h3>
            <ReactQuill
              theme="snow"
              value={editContent}
              onChange={setEditContent}
              modules={quillModules}
              formats={quillFormats}
              className="h-[250px] mb-4"
            />
            <div className="flex justify-end gap-4 mt-20">
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
