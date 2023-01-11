const deleteCookbook = (btn) => {
  const cookbookId = btn.parentNode.querySelector("[name=id]").value;
  const cookbookElement = btn.closest('.card-product');
  console.log(cookbookElement);

  fetch(`/cookbooks/${cookbookId}`, {
    method: "DELETE",
  })
  .then((response) => response.json())
  .then(data => {
    console.log(data);
    cookbookElement.parentNode.removeChild(cookbookElement);
  })
  .catch(err => console.log(err));
}
