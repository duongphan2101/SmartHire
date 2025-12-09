import React, { useState } from 'react';
import { InboxOutlined, LoadingOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { message, Upload, Spin, notification } from 'antd';
import { pdfjs } from 'react-pdf';
import useCV from '../../hook/useCV';
import { uploadPDF } from '../../utils/uploadPDF';
import type { CVData } from '../../utils/interfaces';

const { Dragger } = Upload;

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const CVUploader: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("");
    const [, setDataCVResult] = useState<CVData | null>(null);
    
    const { parseCVText, createCVParse } = useCV();
    const [api, contextHolder] = notification.useNotification();

    const processCV = async (file: File, extractedText: string) => {
        try {
            setLoadingText("AI đang phân tích dữ liệu...");
            
            const aiResponse = await parseCVText(extractedText);

            if (!aiResponse || !aiResponse.data) {
                throw new Error("AI không thể trích xuất thông tin. Vui lòng thử lại hoặc dùng CV khác.");
            }
            const parsedData = aiResponse.data;
            setDataCVResult(parsedData); 
            //console.log("Dữ liệu đã phân tích:", parsedData);

            api.success({
                message: 'Phân tích thành công',
                description: `Đã nhận diện hồ sơ của: ${parsedData.name}`,
                placement: 'bottomRight',
            });
            setLoadingText("Đang tải file PDF lên hệ thống...");
            
            const userStr = localStorage.getItem("user");
            const user = userStr ? JSON.parse(userStr) : null;
            const userId = user?.user_id || user?._id || "unknown";

            const uniqueFileName = `cv_${userId}_${Date.now()}.pdf`;

            const s3Url = await uploadPDF(file, uniqueFileName);
            //console.log("File uploaded to S3:", s3Url);

            setLoadingText("Đang lưu hồ sơ...");

            if (!user) {
                throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
            }

            if (!parsedData) {
                throw new Error("Dữ liệu CV không hợp lệ. Vui lòng thử lại.");
            }

            // Truyền `parsedData` vào hàm tạo, KHÔNG truyền `dataCVResult`
            await createCVParse(userId, parsedData, s3Url);

            message.success("Tạo CV thành công!");

        } catch (error: any) {
            console.error("Quy trình xử lý lỗi:", error);
            const msg = error.message || "Có lỗi xảy ra trong quá trình xử lý.";
            
            message.error(msg);
            api.error({
                message: 'Thất bại',
                description: msg,
            });
        } finally {
            setLoading(false);
            setLoadingText("");
        }
    };

    const extractTextFromPDF = async (file: File) => {
        setLoading(true);
        setLoadingText("Đang đọc nội dung file...");

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjs.getDocument(arrayBuffer).promise;
            let fullText = '';

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item: any) => item.str).join(' ');
                fullText += pageText + '\n';
            }
            
            // Kiểm tra nếu file PDF rỗng (ví dụ PDF ảnh scan không có text layer)
            if (!fullText.trim()) {
                 throw new Error("Không tìm thấy văn bản trong PDF. Hãy đảm bảo đây không phải là bản scan ảnh.");
            }

            await processCV(file, fullText);

        } catch (error: any) {
            console.error("Lỗi đọc PDF:", error);
            message.error(error.message || "Không thể đọc nội dung file PDF này.");
            setLoading(false);
        }
    };

    const props: UploadProps = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        accept: '.pdf',
        showUploadList: false,
        beforeUpload: (file) => {
            const isPDF = file.type === 'application/pdf';
            if (!isPDF) {
                message.error('Chỉ chấp nhận file PDF!');
                return Upload.LIST_IGNORE;
            }

            extractTextFromPDF(file);
            return false; // Chặn upload mặc định của Antd
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    return (
        <div style={{ padding: 20 }}>
            {contextHolder}
            
            <Spin 
                spinning={loading} 
                tip={loadingText} 
                indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            >
                <Dragger {...props} style={{ border: '2px dashed #d9d9d9', backgroundColor: 'transparent' }}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined style={{ color: '#1890ff' }} />
                    </p>
                    <p className="ant-upload-text" style={{ fontSize: '16px', fontWeight: 500 }}>
                        Kéo thả hoặc chọn CV (PDF)
                    </p>
                    <p className="ant-upload-hint" style={{ color: '#666' }}>
                        Hệ thống sẽ tự động phân tích và tạo hồ sơ cho bạn.
                    </p>
                </Dragger>
            </Spin>
        </div>
    );
};

export default CVUploader;