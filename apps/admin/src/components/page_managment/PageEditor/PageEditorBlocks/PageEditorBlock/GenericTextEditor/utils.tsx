import { convertToRaw, ContentState, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

export const convertHTMLToDraftJs = (content: string): EditorState => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const blocksFromHtml = htmlToDraft(content);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { contentBlocks, entityMap } = blocksFromHtml;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
  return EditorState.createWithContent(contentState);
};

export const convertDraftJsToHTML = (editorState: EditorState): string => {
  const rawContentState = convertToRaw(editorState.getCurrentContent());
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  return draftToHtml(rawContentState) as string;
};
