// "use client";

// import { useState } from "react";
// import { ReactNode, MouseEventHandler } from "react";
// import Document from "@tiptap/extension-document";
// import Heading from "@tiptap/extension-heading";
// import Paragraph from "@tiptap/extension-paragraph";
// import Text from "@tiptap/extension-text";
// import Bold from "@tiptap/extension-bold";
// import Italic from "@tiptap/extension-italic";
// import Underline from "@tiptap/extension-underline";
// import Strike from "@tiptap/extension-strike";
// import Blockquote from "@tiptap/extension-blockquote";
// import BulletList from "@tiptap/extension-bullet-list";
// import OrderedList from "@tiptap/extension-ordered-list";
// import ListItem from "@tiptap/extension-list-item";
// import HorizontalRule from "@tiptap/extension-horizontal-rule";
// import { EditorContent, useEditor } from "@tiptap/react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// import {
//   BoldIcon,
//   ItalicIcon,
//   UnderlineIcon,
//   QuoteIcon,
//   ListIcon as BulletListIcon,
//   ListOrderedIcon as OrderedListIcon,
//   Heading1,
//   Heading2,
//   Heading3,
//   Strikethrough,
//   Minus,
// } from "lucide-react";
// interface ToolbarButtonProps {
//   onClick: MouseEventHandler<HTMLButtonElement>;
//   isActive: boolean;
//   icon: ReactNode;
//   label: string;
// }

// const ToolbarButton: React.FC<ToolbarButtonProps> = ({
//   onClick,
//   isActive,
//   icon,
//   label,
// }) => (
//   <Button
//     variant="ghost"
//     size="icon"
//     onClick={onClick}
//     className={`${
//       isActive ? "bg-primary text-primary-foreground" : "bg-background"
//     } hover:bg-primary/90 hover:text-primary-foreground`}
//   >
//     {icon}
//     <span className="sr-only">{label}</span>
//   </Button>
// );

// const Tiptap = () => {
//   const [activeTab, setActiveTab] = useState("edit");
//   const [editorContent, setEditorContent] = useState<string | null>(null);

//   const editor = useEditor({
//     extensions: [
//       Document,
//       Paragraph,
//       Text,
//       Heading.configure({ levels: [1, 2, 3] }),
//       Bold,
//       Italic,
//       Underline,
//       Strike,
//       Blockquote,
//       BulletList,
//       OrderedList,
//       ListItem,
//       HorizontalRule,
//     ],
//     content: `
//   <h1>Welcome to Your Personal Blogging Platform</h1>
//   <p>This is your <strong>rich text editor</strong> where you can craft engaging blog posts. Express your thoughts, share your experiences, and connect with your readers.</p>
//   <h2>Key Features:</h2>
//   <ul>
//     <li>Intuitive text formatting (Bold, Italic, Underline, Strike)</li>
//     <li>Multiple heading levels (H1, H2, H3) for structured content</li>
//     <li>Blockquotes for emphasizing important points</li>
//     <li>Bullet and numbered lists for organized information</li>
//     <li>Horizontal rules to separate sections</li>
//   </ul>
//   <blockquote>Start writing your next captivating blog post right here!</blockquote>
//   <h3>Tips for Engaging Blog Posts:</h3>
//   <ol>
//     <li>Choose a compelling title</li>
//     <li>Use headings to structure your content</li>
//     <li>Include relevant images or media</li>
//     <li>Engage with your readers through questions or calls-to-action</li>
//   </ol>
//   <p>Remember, your unique voice is what makes your blog special. Happy writing!</p>
// `,
//     autofocus: true,
//     editable: true,
//   });

//   if (!editor) return null;
//   const handleSave = () => {
//     console.log("get JSON", editor.getJSON());
//     console.log("get HTML", editor.getHTML());
//     setEditorContent(editor.getHTML());
//   };

//   return (
//     <>
//       <Card className="w-full max-w-4xl mx-auto mt-16">
//         <CardHeader>
//           <CardTitle className="text-center lg:text-3xl md:text-2xl text-xl">
//             Create and Share with Ease
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Tabs value={activeTab} onValueChange={setActiveTab}>
//             <TabsList className="grid grid-cols-2">
//               <TabsTrigger value="edit">Edit</TabsTrigger>
//               <TabsTrigger value="preview">Preview</TabsTrigger>
//             </TabsList>
//             <TabsContent value="edit" className="border rounded-md mt-2">
//               <div className="flex flex-wrap gap-2 p-2 bg-muted rounded-t-md">
//                 {/* Toolbar */}
//                 {[
//                   {
//                     label: "Heading 1",
//                     isActive: editor.isActive("heading", { level: 1 }),
//                     onClick: () =>
//                       editor.chain().focus().toggleHeading({ level: 1 }).run(),
//                     icon: <Heading1 size={18} />,
//                   },
//                   {
//                     label: "Heading 2",
//                     isActive: editor.isActive("heading", { level: 2 }),
//                     onClick: () =>
//                       editor.chain().focus().toggleHeading({ level: 2 }).run(),
//                     icon: <Heading2 size={16} />,
//                   },
//                   {
//                     label: "Heading 3",
//                     isActive: editor.isActive("heading", { level: 3 }),
//                     onClick: () =>
//                       editor.chain().focus().toggleHeading({ level: 3 }).run(),
//                     icon: <Heading3 size={14} />,
//                   },
//                   {
//                     label: "Bold",
//                     isActive: editor.isActive("bold"),
//                     onClick: () => editor.chain().focus().toggleBold().run(),
//                     icon: <BoldIcon size={18} />,
//                   },
//                   {
//                     label: "Italic",
//                     isActive: editor.isActive("italic"),
//                     onClick: () => editor.chain().focus().toggleItalic().run(),
//                     icon: <ItalicIcon size={18} />,
//                   },
//                   {
//                     label: "Underline",
//                     isActive: editor.isActive("underline"),
//                     onClick: () =>
//                       editor.chain().focus().toggleUnderline().run(),
//                     icon: <UnderlineIcon size={18} />,
//                   },
//                   {
//                     label: "Strike",
//                     isActive: editor.isActive("strike"),
//                     onClick: () => editor.chain().focus().toggleStrike().run(),
//                     icon: <Strikethrough size={18} />,
//                   },
//                   {
//                     label: "Blockquote",
//                     isActive: editor.isActive("blockquote"),
//                     onClick: () =>
//                       editor.chain().focus().toggleBlockquote().run(),
//                     icon: <QuoteIcon size={18} />,
//                   },
//                   {
//                     label: "Bullet List",
//                     isActive: editor.isActive("bulletList"),
//                     onClick: () =>
//                       editor.chain().focus().toggleBulletList().run(),
//                     icon: <BulletListIcon size={18} />,
//                   },
//                   {
//                     label: "Ordered List",
//                     isActive: editor.isActive("orderedList"),
//                     onClick: () =>
//                       editor.chain().focus().toggleOrderedList().run(),
//                     icon: <OrderedListIcon size={18} />,
//                   },
//                   {
//                     label: "Horizontal Rule",
//                     isActive: false,
//                     onClick: () =>
//                       editor.chain().focus().setHorizontalRule().run(),
//                     icon: <Minus size={18} />,
//                   },
//                 ].map((button, idx) => (
//                   <ToolbarButton key={idx} {...button} />
//                 ))}
//               </div>
//               <EditorContent
//                 editor={editor}
//                 className="editor max-w-none p-4 focus:outline-none min-h-[300px]"
//               />
//             </TabsContent>
//             <TabsContent value="preview" className="border rounded-md p-4 mt-2">
//               <div
//                 className="editor max-w-none"
//                 dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
//               />
//             </TabsContent>
//           </Tabs>
//           <Button onClick={handleSave} className="w-full mt-4">
//             Save
//           </Button>
//         </CardContent>
//       </Card>
//     </>
//   );
// };

// export default Tiptap;
