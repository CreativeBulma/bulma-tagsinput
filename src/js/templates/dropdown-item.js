import { escape } from "../utils/dom";

export default (data) => {
	return `<a href="javascript:void(0);" class="dropdown-item" data-value="${escape(data.value)}" data-text="${escape(data.text)}">${escape(data.text)}</a>`;
};
