import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import './react-draft-wysiwyg.css';

export interface GenericEditorProps {
  editorState?: EditorState;
  onEditorStateChange: (editorState: EditorState) => void;
  editorClassName?: string;
}

const GenericTextEditor: React.FC<GenericEditorProps> = (props: GenericEditorProps) => {
  const { editorState, onEditorStateChange, editorClassName } = props;

  return (
    <Editor
      editorClassName={editorClassName}
      editorState={editorState}
      stripPastedStyles={true}
      onEditorStateChange={onEditorStateChange}
      toolbar={{
        options: [
          'inline',
          'blockType',
          'list',
          'textAlign',
          'colorPicker',
          'link',
          'embedded',
          'emoji',
          'remove',
          'history',
        ],
        blockType: {
          inDropdown: true,
          options: ['Normal', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code'],
          className: undefined,
          component: undefined,
          dropdownClassName: undefined,
        },
      }}
    />
  );
};

export { GenericTextEditor };
