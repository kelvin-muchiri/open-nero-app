import { Content as ApiContent } from '@nero/query-api-service';
import {
  convertDraftJsToHTML,
  convertHTMLToDraftJs,
} from '../PageEditor/PageEditorBlocks/PageEditorBlock/GenericTextEditor/utils';
import { ContentBlock } from '../pageSlice';

export const convertContentBlockDraftJsToHTML = (blocks: ContentBlock[]): ApiContent => {
  return blocks.map((block) => {
    switch (block.type) {
      case 'text':
        return {
          ...block,
          content: convertDraftJsToHTML(block.content),
        };

      case 'collapse':
        return {
          ...block,
          header: convertDraftJsToHTML(block.header),
          body: convertDraftJsToHTML(block.body),
        };

      case 'grid':
        return {
          ...block,
          children: block.children.map((child) => {
            if (child == null) {
              return null;
            }

            return convertContentBlockDraftJsToHTML([child])[0];
          }),
        };

      default:
        return block;
    }
  }) as ApiContent;
};

convertHTMLToDraftJs;

export const convertContentBlockHTMLToDraftJs = (content: ApiContent): ContentBlock[] => {
  return content.map((block) => {
    switch (block.type) {
      case 'text':
        return {
          ...block,
          content: convertHTMLToDraftJs(block.content),
        };

      case 'collapse':
        return {
          ...block,
          header: convertHTMLToDraftJs(block.header),
          body: convertHTMLToDraftJs(block.body),
        };

      case 'grid':
        return {
          ...block,
          children: block.children.map((child) => {
            if (child == null) {
              return null;
            }

            return convertContentBlockHTMLToDraftJs([child])[0];
          }),
        };

      default:
        return block;
    }
  }) as ContentBlock[];
};
