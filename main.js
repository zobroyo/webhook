$(function () {
  let uploadedImageUrl = "";

  $("#imageUpload").on("change", function (e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (event) {
      uploadedImageUrl = event.target.result;
      $("#avatarUrl").val("");
      $("#log").text("image uploaded and ready to send!");
    };
    reader.readAsDataURL(file);
  });

  $("#btn").click(async function () {
    const link = $("#link").val();
    const username = $("#username").val();
    const content = $("#content").val();
    const avatarUrl = $("#avatarUrl").val() || uploadedImageUrl;
    let count = parseInt($("#count").val()) || 1;

    if (!link || !content) {
      alert("please fill out the webhook link and content!");
      return false;
    }

    if (count < 1) {
      alert("spam count must be 1 or more!");
      return false;
    }

    $("#log").text(`sending ${count} messages...`);

    for (let i = 0; i < count; i++) {
      let payload = {
        content: content,
        username: username || undefined,
      };

      if (avatarUrl) {
        payload.avatar_url = avatarUrl;
      }

      await $.post(link, payload).fail(() => {
        $("#log").text(`failed to send message #${i + 1}`);
      });

      $("#log").text(`sent ${i + 1} of ${count} messages`);
    }

    $("#log").text(`done! sent ${count} messages.`);
  });
});
