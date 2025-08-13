import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import NoteAPI from "../../api/notesApi/NotesAPI";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module-react";

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

  const fetchNotes = async () => {
    try {
      const res = await NoteAPI.getAll({ userId });
      const data = Array.isArray(res.data?.data) ? res.data.data : [];
      setNotes(data);
    } catch {
      Swal.fire("Error", "Failed to fetch notes", "error");
      setNotes([]);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [userId]);

  const handleSaveNote = async () => {
    if (!content.trim()) {
      Swal.fire("Error", "Note content is empty", "error");
      return;
    }
    try {
      await NoteAPI.CreateNote({ content });
      Swal.fire("Added", "Note added successfully!", "success");
      setContent("");
      await fetchNotes();
    } catch {
      Swal.fire("Error", "Failed to save note", "error");
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
        });
      } else {
        Swal.fire("Not found", "Note not found", "info");
      }
    } catch {
      Swal.fire("Error", "Failed to fetch note", "error");
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
        Swal.fire("Not found", "Note not found", "info");
      }
    } catch {
      Swal.fire("Error", "Failed to fetch note", "error");
    }
  };

  const handleUpdateNote = async () => {
    if (!editContent.trim()) {
      Swal.fire("Error", "Note content is empty", "error");
      return;
    }
    try {
      await NoteAPI.UpdateNote(editNoteId!, { content: editContent });
      Swal.fire("Updated", "Note updated successfully!", "success");
      setIsEditModalOpen(false);
      setEditNoteId(null);
      setEditContent("");
      await fetchNotes();
    } catch {
      Swal.fire("Error", "Failed to update note", "error");
    }
  };

  const handleDelete = async (noteId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This note will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      try {
        await NoteAPI.DeleteNote(noteId);
        Swal.fire("Deleted", "Note deleted successfully!", "success");
        fetchNotes();
      } catch {
        Swal.fire("Error", "Failed to delete note", "error");
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
    <div className="mt-6">
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
          className="px-6 py-2 bg-[#16968F] text-white rounded hover:bg-teal-700 mt-20"
        >
          Add a Note
        </button>
      </div>

      <div className="h-80 overflow-y-auto pr-2 mt-4">
        {notes.map((note) => {
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = note.content;
          const plainText = tempDiv.textContent || tempDiv.innerText || "";

          const isTruncated = plainText.length > 50;
          const visibleText = plainText.substring(0, 50);

          return (
            <div
              key={note._id}
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
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                    >
                      ... see more
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500 whitespace-nowrap mr-24">
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
            </div>
          );
        })}
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg w-[700px] h-[450px] p-4">
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
                className="px-4 py-2 bg-[#16968F] text-white rounded hover:bg-teal-700"
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
