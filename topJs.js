document.addEventListener('DOMContentLoaded', function() {
    // カテゴリ選択時
    document.getElementById('category').addEventListener('change', updateEmotionOptions);

    // 初期表示を設定
    updateEmotionOptions();

    // フォーム送信時の処理
    document.getElementById('emoForm').addEventListener('submit', function(event) {
        event.preventDefault();

        // 入力値を取得
        const category = document.getElementById('category').value;
        const emotion = document.getElementById('emotion').value;
        const intensity = document.getElementById('intensity').value;
        const eventDescription = document.getElementById('event').value;

        // 保存するデータを作成
        const record = {
            category: category,
            emotion: emotion,
            intensity: intensity,
            event: eventDescription,
            date: new Date().toISOString().split('T')[0]
        };

        let records = JSON.parse(localStorage.getItem('moodRecords')) || [];
        records.push(record);

        // ローカルストレージに記録を保存
        localStorage.setItem('moodRecords', JSON.stringify(records));

        // メッセージ表示
        showSaveMessage();

        // フォームをリセット
        document.getElementById('emoForm').reset();
    });

    //保存時のポップアップ
    function showSaveMessage() {
        const message = document.getElementById('saveMessage');
        message.classList.remove('hidden'); // 表示
    
        // 2秒後に非表示
        setTimeout(() => {
            message.classList.add('hidden');
        }, 2000);
    }

    // カテゴリに合わせた感情表示
    function updateEmotionOptions() {
        let category = document.getElementById('category').value;
        let emotionSelect = document.getElementById('emotion');
        emotionSelect.innerHTML = ''; // 既存の選択肢をクリア

        let emotions = [];
        if (category === 'positive') {
            emotions = ['いい気分', 'うれしい', '楽しい', 'びっくり', 'やる気'];
        } else if (category === 'negative') {
            emotions = ['イライラ', '悲しい', '不安', 'さみしい', 'つらい', 'ゆううつ'];
        } else if (category === 'other') {
            emotions = ['リラックス', 'そわそわ', '緊張'];
        }

        // 感情の選択肢を作成
        emotions.forEach(function(emotion) {
            let option = document.createElement('option');
            option.value = emotion;
            option.textContent = emotion;

            emotionSelect.appendChild(option);
        });
    }
});


