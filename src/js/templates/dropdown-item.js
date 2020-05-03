export default (data) => {
	return `<a href="javascript:void(0);" class="dropdown-item" data-value="${data.value}" data-text="${data.text}">${data.text}</a>`;
};