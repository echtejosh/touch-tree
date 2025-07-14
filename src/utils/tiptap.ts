import { Node, Mark } from '@tiptap/core';

function addAttributes(extensions: Node | Mark) {
    return extensions.extend({
        addAttributes() {
            return {
                id: {
                    default: null,
                    parseHTML: (element: HTMLElement) => element.getAttribute('id'),
                },
                style: {
                    default: null,
                    parseHTML: (element: HTMLElement) => element.getAttribute('style'),
                },
                class: {
                    default: null,
                    parseHTML: (element: HTMLElement) => element.getAttribute('class'),
                },
                src: {
                    default: null,
                    parseHTML: (element: HTMLElement) => element.getAttribute('src'),
                },
                'data-file_basename': {
                    default: null,
                    parseHTML: (element: HTMLElement) => element.getAttribute('data-file_basename'),
                },
            };
        },
    });
}

export default {
    addAttributes,
};
