document.addEventListener("DOMContentLoaded", () => {
  const text = "Dear Tanya,\nblah blah blah blah blah...";
  const typewriterElement = document.getElementById("typewriter");
  const button = document.getElementById("growth-btn");

  let index = 0;

  function typeWriter() {
    if (index < text.length) {
      typewriterElement.textContent += text.charAt(index);
      index++;
      setTimeout(typeWriter, 50); // typing speed
    } else {
      // Show button once typing is complete
      button.classList.add("show");
    }
  }

  typeWriter();
});
