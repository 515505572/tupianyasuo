// 获取DOM元素
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const compressControl = document.getElementById('compressControl');
const previewArea = document.getElementById('previewArea');
const qualityInput = document.getElementById('quality');
const qualityValue = document.getElementById('qualityValue');
const originalImage = document.getElementById('originalImage');
const compressedImage = document.getElementById('compressedImage');
const originalSize = document.getElementById('originalSize');
const compressedSize = document.getElementById('compressedSize');
const downloadBtn = document.getElementById('downloadBtn');

// 初始化变量
let originalFile = null;

// 修改上传区域点击事件
uploadArea.addEventListener('click', (e) => {
    // 阻止事件冒泡
    e.stopPropagation();
    // 触发文件选择
    fileInput.click();
});

// 添加上传框点击事件
document.querySelector('.upload-box').addEventListener('click', (e) => {
    // 阻止事件冒泡
    e.stopPropagation();
    // 触发文件选择
    fileInput.click();
});

// 拖拽上传
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
    uploadArea.querySelector('.upload-box').style.borderColor = '#0071e3';
});

uploadArea.addEventListener('dragleave', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    uploadArea.querySelector('.upload-box').style.borderColor = '#86868b';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    uploadArea.querySelector('.upload-box').style.borderColor = '#86868b';
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleFile(file);
    }
});

// 添加文件选择变化事件的错误处理
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        if (!file.type.match('image.*')) {
            alert('请选择图片文件！');
            return;
        }
        handleFile(file);
    }
});

// 质量滑块变化事件
qualityInput.addEventListener('input', (e) => {
    qualityValue.textContent = `${e.target.value}%`;
    if (originalFile) {
        compressImage(originalFile, e.target.value / 100);
    }
});

// 处理上传的文件
function handleFile(file) {
    // 验证文件类型
    if (!file.type.match('image.*')) {
        alert('请上传图片文件！');
        return;
    }
    
    originalFile = file;
    
    // 显示原图大小
    originalSize.textContent = formatFileSize(file.size);
    
    // 预览原图
    const reader = new FileReader();
    reader.onload = (e) => {
        originalImage.src = e.target.result;
        // 使用当前质量值压缩图片
        compressImage(file, qualityInput.value / 100);
    };
    reader.readAsDataURL(file);
    
    // 显示控制和预览区域
    compressControl.style.display = 'block';
    previewArea.style.display = 'block';
}

// 压缩图片
function compressImage(file, quality) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            // 创建 canvas
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            
            // 绘制图片
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            // 转换为 blob
            canvas.toBlob((blob) => {
                // 更新压缩后的预览
                compressedImage.src = URL.createObjectURL(blob);
                compressedSize.textContent = formatFileSize(blob.size);
                
                // 更新下载按钮
                downloadBtn.onclick = () => {
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = `compressed_${file.name}`;
                    link.click();
                };
            }, file.type, quality);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 添加页面加载动画
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
}); 