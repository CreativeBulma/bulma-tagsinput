import { escape } from "../utils/dom";

export default (data) => {
	return `<div class="tags-input">
        <input class="input" type="text" placeholder="${escape(data.placeholder)}">
        <div id="${escape(data.uuid)}-list" class="dropdown-menu" role="menu">
            <div class="dropdown-content">
                <span class="dropdown-item empty-title">${escape(data.emptyTitle)}</span>
            </div>
        </div>
    </div>`;
};
