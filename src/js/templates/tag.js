export default (data) => {
	return `<span class="tag ${data.style}" data-value="${data.value}">
        ${data.text}
        ${data.removable ? '<div class="delete is-small" data-tag="delete"></div>' : ''}
    </span>`;
};