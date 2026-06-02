// 配置每个存档位的图片
const SLOT_IMAGES = {
    1: '../images/芮娜.jpg',
    2: '../images/捷风.jpg',
    3: '../images/夜露.jpg',
    4: '../images/蝰蛇.jpg',
    5: '../images/五人.jpg',
    6: '../images/KO.jpg'
};

// Tailwind 配置
tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#4a90e2',
                secondary: '#2ecc71',
                dark: '#1a1a1a',
                darker: '#121212',
                'dark-card': '#222222',
            },
            fontFamily: {
                game: ['"Press Start 2P"', 'system-ui', 'sans-serif'],
            },
        }
    }
}