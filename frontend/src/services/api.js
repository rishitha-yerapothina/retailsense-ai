const API_BASE = import.meta.env.VITE_API_BASE || 'https://retailsense-ai-ju0p.onrender.com/';

// Check if browser supports Web Speech API
export function supportsRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  return !!SpeechRecognition;
}

// Request microphone permission
export async function requestMicrophonePermission() {
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    return true;
  } catch (error) {
    if (error.name === 'NotAllowedError') {
      throw new Error('Microphone permission was denied.');
    } else if (error.name === 'NotFoundError') {
      throw new Error('No microphone device found.');
    } else {
      throw new Error(`Unable to access microphone: ${error.message}`);
    }
  }
}

export function analyzeAudio(file, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    formData.append('file', file);
    xhr.open('POST', `${API_BASE}/analyze-audio`, true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch (error) {
            reject(new Error('Unable to parse response from the backend.'));
          }
        } else {
          reject(new Error(xhr.responseText || 'Audio analysis failed.'));
        }
      }
    };

    xhr.onerror = () => reject(new Error('Network error while uploading audio.'));
    xhr.send(formData);
  });
}

export async function analyzeText(data) {
  const response = await fetch(`${API_BASE}/analyze-text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Text analysis request failed.');
  }
  return response.json();
}

export async function getHistory() {
  const response = await fetch(`${API_BASE}/history`);
  if (!response.ok) {
    throw new Error('Unable to load history.');
  }
  return response.json();
}

export async function deleteHistory(id) {
  const response = await fetch(`${API_BASE}/history/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Could not delete history entry.');
  }
  return response.json();
}
