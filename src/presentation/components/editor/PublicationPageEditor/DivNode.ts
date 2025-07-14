import { Node } from '@tiptap/core';

export const DivNode = Node.create({
    name: 'div',
    content: 'block+',
    group: 'block',
    parseHTML() {
        return [
            {
                tag: 'div',
                getAttrs: (node) => {
                    const isNonTextContentElement = (element: HTMLElement): boolean => {
                        // List of elements that are considered non-text content
                        const nonTextContentTags = ['IMG', 'BR', 'HR', 'INPUT', 'BUTTON', 'IFRAME', 'VIDEO', 'AUDIO', 'CANVAS'];
                        return nonTextContentTags.includes(element.tagName);
                    };

                    const shouldRemoveTree = (element: HTMLElement): boolean => {
                        if (!(element instanceof HTMLElement)) return true;

                        // Check if the element itself is a non-text content element (e.g., <img>, <br>)
                        if (isNonTextContentElement(element)) {
                            return false;
                        }

                        if (!element.hasChildNodes()) {
                            return element.textContent?.trim() === String();
                        }

                        return Array.from(element.children)
                            .filter((child): child is HTMLElement => child instanceof HTMLElement)
                            .every(shouldRemoveTree);
                    };

                    if (shouldRemoveTree(node)) {
                        return false; // Remove this node and everything inside it
                    }

                    return null; // Keep the node
                },
            },
        ];
    },
    renderHTML({ HTMLAttributes }) {
        return ['div', HTMLAttributes, 0];
    },
});
