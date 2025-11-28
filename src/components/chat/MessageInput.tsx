import { useRef, useState } from "react";
import { Image, Send, X } from "lucide-react";
import useChatStore from "../../store/useChatStore";


const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState<{ id: number, url: string }[]>([]);
  const fileInputRef = useRef<any>(null);
  const [selectedFiles, setSelectedFiles] = useState<any[]>([])
  const { sendMessage ,selectedUser} = useChatStore()

  // const { sendMessage } = useChatStore();
  console.log(selectedFiles, 'selectedFiles')
  const handleImageChange = async (e: any) => {
    const files: any[] = Array.from(e.target.files);
    setSelectedFiles(files?.map((data, index) => ({
      file: data,
      id: index + 1
    })))
    const previews: any[] = await Promise.all(
      files.map(
        (file: any, index) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onloadend = () => {
              resolve({
                id: index + 1,
                url: reader.result,
              });
            };
          })
      )
    );

    setImagePreview(previews);
    console.log(previews, "files");
  };


  const removeImage = (id: number) => {
    const newImagePreview = imagePreview.filter((data) => data.id != id);
    setImagePreview(newImagePreview);
    setSelectedFiles((preview) => preview.filter((data) => data.id != id));
    if (fileInputRef.current.value) fileInputRef.current.value = ''
  };

  const handleSendMessage = async (e: any) => {
    e.preventDefault();

    if (!text.trim() && imagePreview.length == 0) return;
    try {
      const formData = new FormData();
      formData.append('text', text);
      formData.append('isRead', selectedUser? 'true' : 'false')
      selectedFiles.forEach(({ file }) => {
        formData.append("images", file);
      });
      await sendMessage(formData);
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="flex gap-2 items-center">
            {imagePreview?.map(({ id, url }) => {
              return <div className="relative">
                <img
                  src={url}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
                />
                <button
                  onClick={() => removeImage(id)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
                  type="button"
                >
                  <X className="size-3" />
                </button>
              </div>
            })}

          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;
