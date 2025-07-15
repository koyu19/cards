// HTML要素の取得
const currentCardImg = document.getElementById('current-card');
const nextCardPlaceholderImg = document.getElementById('next-card-placeholder');
const highButton = document.getElementById('high-button');
const lowButton = document.getElementById('low-button');
const messageElement = document.getElementById('message');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('start-button');

// ゲームの状態変数
let deck = [];
let currentCard = null;
let score = 0;
let isGameActive = false;

// カードのデータを定義 (A=1, J=11, Q=12, K=13)
const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

// デッキを生成
function createDeck() {
    deck = [];
    for (const suit of suits) {
        for (let i = 0; i < ranks.length; i++) {
            deck.push({
                rank: ranks[i],
                value: i + 1, // A=1, K=13
                suit: suit,
                image: `https://deckofcardsapi.com/static/img/${ranks[i]}${suit.charAt(0).toUpperCase()}.png` // 例: DA (ダイヤのエース)
            });
        }
    }
}

// デッキをシャッフル
function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]]; // 配列の要素を交換
    }
}

// カードの画像を更新
function updateCardImages() {
    currentCardImg.src = currentCard ? currentCard.image : 'https://via.placeholder.com/100x150?text=Card';
    nextCardPlaceholderImg.src = 'https://via.placeholder.com/100x150?text=?'; // 次のカードは裏面
}

// スコアを更新
function updateScoreDisplay() {
    scoreElement.textContent = score;
}

// メッセージを表示
function displayMessage(msg, color = 'black') {
    messageElement.textContent = msg;
    messageElement.style.color = color;
}

// ゲーム開始時の初期化
function startGame() {
    createDeck();
    shuffleDeck();
    score = 0;
    updateScoreDisplay();
    displayMessage('ゲーム開始！HighかLowを選んでね。', 'blue');
    isGameActive = true;
    
    // 最初のカードを引く
    currentCard = deck.pop();
    updateCardImages();

    highButton.disabled = false;
    lowButton.disabled = false;
    startButton.style.display = 'none'; // ゲーム開始ボタンを非表示
}

// プレイヤーがHighまたはLowを選択したときの処理
function makeGuess(playerGuess) {
    if (!isGameActive) return;

    if (deck.length === 0) {
        endGame('デッキがなくなりました！');
        return;
    }

    const nextCard = deck.pop();

    // 次のカードの画像を一時的に表示（演出のため）
    nextCardPlaceholderImg.src = nextCard.image;

    // 少し遅延させて結果を表示
    setTimeout(() => {
        let result = '';
        let isCorrect = false;

        if (nextCard.value > currentCard.value) {
            result = 'Highでした！';
            if (playerGuess === 'high') {
                isCorrect = true;
            }
        } else if (nextCard.value < currentCard.value) {
            result = 'Lowでした！';
            if (playerGuess === 'low') {
                isCorrect = true;
            }
        } else {
            result = '引き分けでした！'; // 同値の場合
            isCorrect = true; // 引き分けは正解扱いにする
        }

        if (isCorrect) {
            score++;
            displayMessage(`${result} 正解！`, 'green');
        } else {
            displayMessage(`${result} 不正解...`, 'red');
            endGame('ゲームオーバー！');
            return;
        }

        updateScoreDisplay();
        currentCard = nextCard; // 次のカードを現在のカードにする
        updateCardImages(); // 新しい現在のカードを表示

        if (deck.length === 0) {
            endGame('デッキを使い切りました！');
        }
    }, 1000); // 1秒後に結果を表示
}

// ゲーム終了処理
function endGame(msg) {
    displayMessage(msg + ` 最終スコア: ${score}`, 'darkred');
    isGameActive = false;
    highButton.disabled = true;
    lowButton.disabled = true;
    startButton.style.display = 'block'; // ゲーム開始ボタンを再表示
}

// イベントリスナー
highButton.addEventListener('click', () => makeGuess('high'));
lowButton.addEventListener('click', () => makeGuess('low'));
startButton.addEventListener('click', startGame);

// 初期表示
displayMessage('「ゲーム開始」ボタンを押してね', 'gray');
updateCardImages();
highButton.disabled = true;
lowButton.disabled = true;
