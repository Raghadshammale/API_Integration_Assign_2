const API_KEY = 'd1762037f72a844ce2d90499c3de4abf'; 

async function getWeather() {
    const city = document.getElementById('cityInput').value.trim();
    
    if (!city) {
        showError('الرجاء إدخال اسم المدينة');
        return;
    }
    
    const resultDiv = document.getElementById('weatherResult');
    resultDiv.innerHTML = '<div class="temp">⏳ جاري البحث...</div>';
    
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.cod === 200) {
            displayWeather(data);
        } else if (data.cod === 404) {
            showError(`❌ المدينة "${city}" غير موجودة`);
        } else if (data.cod === 401) {
            showError('❌ خطأ في مفتاح API');
        } else {
            showError(`⚠️ خطأ: ${data.message}`);
        }
    } catch (error) {
        showError('⚠️ فشل الاتصال بالإنترنت أو الـ API');
    }
}

function displayWeather(data) {
    const weatherDesc = data.weather[0].description;
    const temp = Math.round(data.main.temp);
    const feelsLike = Math.round(data.main.feels_like);
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    
    const html = `
        <h2>📍 ${data.name}, ${data.sys.country}</h2>
        <div class="temp">🌡️ ${temp}°C</div>
        <div class="weather-desc">🌥️ ${weatherDesc}</div>
        <div class="details">
            <div class="detail-item">
                <div class="detail-value">${humidity}%</div>
                <div class="detail-label">الرطوبة</div>
            </div>
            <div class="detail-item">
                <div class="detail-value">${windSpeed} m/s</div>
                <div class="detail-label">الرياح</div>
            </div>
            <div class="detail-item">
                <div class="detail-value">${feelsLike}°C</div>
                <div class="detail-label">شعور حراري</div>
            </div>
        </div>
    `;
    document.getElementById('weatherResult').innerHTML = html;
}

function showError(message) {
    document.getElementById('weatherResult').innerHTML = `<div class="error">${message}</div>`;
}

document.getElementById('cityInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') getWeather();
});

document.getElementById('searchBtn').addEventListener('click', getWeather);
