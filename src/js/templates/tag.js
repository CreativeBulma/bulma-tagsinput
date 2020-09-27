import { escape } from "../utils/dom";

export default (data) => {
	return `<span class="tag ${escape(data.style)}" data-value="${escape(data.value)}">
        ${escape(data.text)}
        ${data.removable ? '<div class="delete is-small" data-tag="delete"></div>' : ''}
    </span>`;
};
