import React from "react";
import { Editor } from "@tinymce/tinymce-react";

const WordEditor = ({ value, onChange }) => {
  return (
    <Editor
      apiKey="pshc10jc6u8utuubxxyt12ppwbzeiihhlrtmx4t1ffu5sddp"
      value={value}
      onEditorChange={(content) => onChange(content)}
      init={{
        height: 600,
        menubar: true,

        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "help",
          "wordcount",
        ],

        toolbar:
          "undo redo | styles | fontfamily fontsize | " +
          "bold italic underline strikethrough | forecolor backcolor | " +
          "alignleft aligncenter alignright alignjustify | " +
          "bullist numlist outdent indent | " +
          "table image media link | removeformat fullscreen",

        font_family_formats:
          "Arial=arial,helvetica,sans-serif;" +
          "Times New Roman=times new roman,times;" +
          "Calibri=calibri;" +
          "Georgia=georgia;" +
          "Verdana=verdana;",

        fontsize_formats: "10px 12px 14px 16px 18px 24px 32px 48px",

        content_style: `
          body {
            font-family: Calibri, Arial, sans-serif;
            font-size: 14px;
            line-height: 1.6;
            padding: 20px;
          }
        `,
      }}
    />
  );
};

export default WordEditor;
