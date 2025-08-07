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

  const fetchNotes = async () => {
    try {
      const res = await NoteAPI.getAll({ userId });
      const data = Array.isArray(res.data?.data) ? res.data.data : [];
      setNotes(data);
    } catch (err) {
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
      if (editNoteId) {
        await NoteAPI.UpdateNote(editNoteId, { content });
        Swal.fire("Updated", "Note updated successfully!", "success");
      } else {
        await NoteAPI.CreateNote({ content });
        Swal.fire("Added", "Note added successfully!", "success");
      }
      setContent("");
      setEditNoteId(null);
      await fetchNotes();
    } catch (err) {
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
    } catch (err) {
      Swal.fire("Error", "Failed to fetch note", "error");
    }
  };

  const handleEdit = async (noteId: string) => {
    try {
      const res = await NoteAPI.GetNoteById(noteId);
      const note = res.data;
      if (note) {
        setContent(note.content);
        setEditNoteId(note._id);
      } else {
        Swal.fire("Not found", "Note not found", "info");
      }
    } catch (err) {
      Swal.fire("Error", "Failed to fetch note", "error");
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
      } catch (err) {
        Swal.fire("Error", "Failed to delete note", "error");
      }
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      [{ font: [] }],
      [{ size: [] }],
      [{ color: [] }, { background: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ script: "sub" }, { script: "super" }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["blockquote", "code-block"],
      ["link", "image", "video"],
      ["blockquote", "code-block"],
      ["clean"],
    ],
    imageResize: {
      parchment: Quill.import("parchment"),
    },
  };

  const quillFormats = [
    "header",
    "font",
    "size",
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
      <div className="border rounded bg-white mb-3">
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
          className="px-6 py-2 bg-[#16968F] text-white rounded hover:bg-teal-700 mt-24"
        >
          {editNoteId ? "Update Note" : "Add a Note"}
        </button>
      </div>
      <div className="h-80 overflow-y-auto pr-2 mt-4">
        {notes.map((note) => (
          <div
            key={note._id}
            className="border rounded p-3 mb-3 bg-white shadow-sm relative"
          >
            <div
              dangerouslySetInnerHTML={{ __html: note.content }}
              className="text-sm mb-2"
            />
            <div className="text-xs text-gray-500 ">
              {new Date(note.createdAt).toLocaleDateString()}
            </div>
            <div className="absolute top-3 right-3 flex gap-4">
              <button title="View" onClick={() => handleView(note._id)}>
                <img
                  src="/icons/eyeView-icon.svg"
                  alt="view"
                  className="w-4 h-4"
                />
              </button>
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
        ))}
      </div>
    </div>
  );
};
export default NotesSection;
