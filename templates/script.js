const video = document.getElementById('preview');
    const startBtn = document.getElementById('startRecord');
    const stopBtn = document.getElementById('stopRecord');
    const dashboard = document.getElementById('dashboard');
    const journalDiv = document.getElementById('journalText');
    const recordSection = document.getElementById('record');

    let mediaRecorder;
    let chunks = [];

    // Request camera & mic access
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        video.srcObject = stream;
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = e => chunks.push(e.data);

        mediaRecorder.onstop = async () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          const formData = new FormData();
          formData.append('video', blob, 'journal.webm');

          // Upload to Flask
          const response = await fetch('/upload', {
            method: 'POST',
            body: formData
          });
          const data = await response.text();

          // Show dashboard
          recordSection.style.display = "none";
          dashboard.style.display = "flex";
          journalDiv.innerHTML = data;

          // Chart (example, static numbers for now)
          new Chart(document.getElementById('moodChart'), {
            type: 'radar',
            data: {
              labels: ['Happy', 'Calm', 'Focused', 'Stressed', 'Excited'],
              datasets: [{
                label: 'Your Mood',
                data: [65, 80, 70, 40, 90],
                backgroundColor: 'rgba(54,162,235,0.2)',
                borderColor: 'rgba(54,162,235,1)',
                borderWidth: 2
              }]
            }
          });
        };
      });

    // Start 5s recording
    startBtn.onclick = () => {
    chunks = [];
    mediaRecorder.start();
    startBtn.textContent = "Recording...";
    stopBtn.style.display = "inline-block"; // ✅ show stop button
    };

// Stop recording
  stopBtn.onclick = () => {
    mediaRecorder.stop();
    startBtn.textContent = "Start Recording";
    stopBtn.style.display = "none"; // ✅ hide stop button again
  };
