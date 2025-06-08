
import { ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';

const stickers = ref([]);
const backgroundImageUrl = ref('');
const pageBackgroundColor = ref('#f0f0f0'); 
const isDraggable = ref(true);
const canvasPosition = ref({ x: 0, y: 0 }); // 新增画布位置状态

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

    const loadStickers = (importData) => {
        const stickersWithIds = importData.stickers.map(s => ({ ...s, id: s.id || uuidv4() }));
        stickers.value = stickersWithIds;
        
        if (importData.backgroundImageUrl) {
            backgroundImageUrl.value = importData.backgroundImageUrl;
        }

        if (importData.pageBackgroundColor) {
            pageBackgroundColor.value = importData.pageBackgroundColor;
        }

        // 新增：加载画布初始位置
        if (importData.canvasPosition) {
            canvasPosition.value = importData.canvasPosition;
        }
    };

    const exportStickers = () => {
        const exportData = {
            backgroundImageUrl: backgroundImageUrl.value,
            pageBackgroundColor: pageBackgroundColor.value, 
            stickers: stickers.value,
            canvasPosition: canvasPosition.value // 新增：导出画布位置
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

    const updateCanvasPosition = (deltaX, deltaY) => {
        canvasPosition.value.x += deltaX;
        canvasPosition.value.y += deltaY;
    };

    const toggleDrag = () => {
        isDraggable.value = !isDraggable.value;
    };

    return {
        stickers,
        backgroundImageUrl,
        pageBackgroundColor, 
        isDraggable,
        canvasPosition,
        addSticker,
        loadStickers,
        exportStickers,
        updateStickerPosition,
        updateCanvasPosition,
        toggleDrag
    };
}
