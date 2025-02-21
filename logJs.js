
document.addEventListener('DOMContentLoaded', function() {

    // 日付切り替えボタン
    const todayBtn = document.getElementById('today');
    const monthBtn = document.getElementById('month');
    // グラフ切り替えボタン
    const frequencyBtn = document.getElementById('frequency'); // 頻度グラフ
    const strengthBtn = document.getElementById('strength');   // 強さグラフ

    // 初期表示は今日のデータ、頻度グラフ
    let selectedDate = new Date();
    let graphType = 'frequency';

    // 月日切り替え
    todayBtn.addEventListener('click', function() {
        selectedDate = new Date(); // 今日の日付
        displayData(selectedDate, 'day', graphType);
    });
    
    monthBtn.addEventListener('click', function() {
        selectedDate = new Date(); // 今月の日付
        selectedDate.setDate(1); // 月初めに設定
        displayData(selectedDate, 'month', graphType);
    });

    // グラフタイプ切り替え
    frequencyBtn.addEventListener('click', function() {
        graphType = 'frequency';
        displayData(selectedDate, getCurrentViewType(selectedDate), graphType);
    });
        
    strengthBtn.addEventListener('click', function() {
        graphType = 'strength';
        displayData(selectedDate, getCurrentViewType(selectedDate), graphType);
    });
    
    // 現在選択中の月日を取得
    function getCurrentViewType(date) {
        return date.getDate() === 1 ? 'month' : 'day';
    }

    // データの表示
    function displayData(date, dayType, graphType) {
        // ローカルストレージから記録を取得
        const records = JSON.parse(localStorage.getItem('moodRecords')) || [];
        
        // 月ごと・日ごとのフィルタリング
        const filteredRecords = records.filter(record => {
            if (dayType === 'day') {
                return record.date === date.toISOString().split('T')[0]; // 文字列で比較
            } else if (dayType === 'month') {
                return record.date.startsWith(date.toISOString().slice(0, 7)); // YYYY-MM で比較
            }
        });
        

        // 記録の表示
        const dataLog = document.getElementById('dataLog');
        dataLog.innerHTML = ''; // 既存の内容をクリア
        displayLog(filteredRecords);

        // グラフを描画
        if(graphType === 'frequency'){
        drawGraphCnt(filteredRecords);
        }else{
        drawGraph(filteredRecords);
        }
    }

    function displayLog(records) {
        const dataLog = document.getElementById('dataLog');
        dataLog.innerHTML = ''; // 既存のログをクリア
        
        // テーブルを作成
        const table = document.createElement('table');
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `
            <th>保存日</th>
            <th>キブン</th>
            <th>強さ</th>
            <th>出来事</th>
        `;
        table.appendChild(headerRow);
    
        // レコードをテーブルの行として追加
        records.forEach(record => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${record.date}</td>
                <td>${record.emotion}</td>
                <td>${record.intensity}%</td>
                <td>${record.event}</td>
            `;
            table.appendChild(row);
        });
    
        // テーブルをdataLogに追加
        dataLog.appendChild(table);
    }

    // グラフ描画 (感情の回数割合)
    function drawGraphCnt(records) {
        const dataGraph = document.getElementById('dataGraph');
        dataGraph.innerHTML = ''; // 既存のグラフをクリア
        
        // 感情の割合を計算
        const emotionCounts = {};
        records.forEach(record => {
            if (!emotionCounts[record.emotion]) {
                emotionCounts[record.emotion] = 0;
            }
            emotionCounts[record.emotion]++;
        });

        // グラフ用のデータを作成
        const labels = Object.keys(emotionCounts);
        const data = labels.map(label => emotionCounts[label]);

        // 円グラフを描画
        const canvas = document.createElement('canvas');
        dataGraph.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        // Chart.jsを使って円グラフを描画
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: ['#ff9999', '#66b3ff', '#99ff99', '#ffcc99', '#c2c2f0'],
                    borderColor: '#fff',
                    borderWidth: 1
                }]
            }
        });
    }

    // グラフ描画 (感情の強さ割合)
    function drawGraph(records) {
        const dataGraph = document.getElementById('dataGraph');
        dataGraph.innerHTML = ''; // 既存のグラフをクリア
    
        // 強さの合計を計算
        const emotionStrengths = {};
        records.forEach(record => {
            if (!emotionStrengths[record.emotion]) {
                emotionStrengths[record.emotion] = 0;
            }
            emotionStrengths[record.emotion] += parseInt(record.intensity); // 強さを合算
        });

        // グラフ用のデータを作成
        const labels = Object.keys(emotionStrengths);
        const data = labels.map(label => emotionStrengths[label]);

        // 円グラフを描画
        const canvas = document.createElement('canvas');
        dataGraph.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        // Chart.jsを使って円グラフを描画
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: ['#ff9999', '#66b3ff', '#99ff99', '#ffcc99', '#c2c2f0'],
                    borderColor: '#fff',
                    borderWidth: 1
                }]
            }
        });
    }

    // 現在の日付から3ヶ月前の日付を取得
    function getSixMonthsAgo() {
        const today = new Date();
        today.setMonth(today.getMonth() - 3);
        return today.toISOString().split('T')[0];  // 日付部分だけを取得
    }

    //6カ月より前のデータを削除する
    function deleteOldData() {
        let data = JSON.parse(localStorage.getItem('moodRecords')) || [];
        const sixMonthsAgo = getSixMonthsAgo();
    
        // 6ヶ月前より古いデータをフィルタリング
        data = data.filter(entry => entry.date >= sixMonthsAgo);
    
        // フィルタリングしたデータを再保存
        localStorage.setItem('moodRecords', JSON.stringify(data));
    }

    // 全削除ボタン
    const clearAllBtn = document.getElementById('clearAll');
    clearAllBtn.addEventListener('click', function() {
        if (confirm('本当にすべての記録を削除しますか？')) {
            localStorage.removeItem('moodRecords'); // 全データ削除
            displayData(selectedDate, getCurrentViewType(selectedDate), graphType); // 画面更新
        }
    });

    // 初期表示
    deleteOldData();
    displayData(selectedDate, 'day', graphType);
});
