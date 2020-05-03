export default (data) => {
	return `<div class="tags-input">
        <input class="input" type="text" placeholder="${data.placeholder}">
        <div id="${data.uuid}-list" class="dropdown-menu" role="menu">
            <div class="dropdown-content">
                <span class="dropdown-item empty-title">${data.emptyTitle}</span>
            </div>
        </div>
    </div>`;
};