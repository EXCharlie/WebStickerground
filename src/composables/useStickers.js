import { ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';

const stickers = ref([]);
const backgroundImageUrl = ref('');
const pageBackgroundColor = ref('#f0f0f0'); 
const isDraggable = ref(true);

export function useStickers() {

    const addSticker = (stickerData) => {
        const defaultPosition = { x: window.innerWidth / 2 - 125, y: window.innerHeight / 2 - 125 };
        
        const newSticker = {
            id: uuidv4(),
            position: stickerData.position || defaultPosition,
            type: stickerData.type,
            content: stickerData.content,
            options: stickerData.options || {}
        };
        stickers.value.push(newSticker);
    };

    // Load stickers from an imported object
const loadStickers = (importData) => {
        const stickersWithIds = importData.stickers.map(s => ({ ...s, id: s.id || uuidv4() }));
        stickers.value = stickersWithIds;
        
        if (importData.backgroundImageUrl) {
            backgroundImageUrl.value = importData.backgroundImageUrl;
        }

        if (importData.pageBackgroundColor) {
            pageBackgroundColor.value = importData.pageBackgroundColor;
        }
    };


const exportStickers = () => {
        const exportData = {
            backgroundImageUrl: backgroundImageUrl.value,
            pageBackgroundColor: pageBackgroundColor.value, 
            stickers: stickers.value
        };
        const jsonData = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'stickerground.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    const updateStickerPosition = (id, newPosition) => {
        const sticker = stickers.value.find(s => s.id === id);
        if (sticker) {
            sticker.position = newPosition;
        }
    };

    const toggleDrag = () => {
        isDraggable.value = !isDraggable.value;
    };

    return {
        stickers,
        backgroundImageUrl,
        pageBackgroundColor, 
        isDraggable,
        addSticker,
        loadStickers,
        exportStickers,
        updateStickerPosition,
        toggleDrag
    };
}