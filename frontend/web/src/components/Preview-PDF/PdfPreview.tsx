import { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

interface CVViewerProps {
  pdfUrl: string;
}

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const CVViewer: React.FC<CVViewerProps> = ({ pdfUrl }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth - 30);
      }
    };

    updateWidth();

    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  return (
    <Box 
      ref={containerRef}
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        bgcolor: '#f5f5f5', 
        p: 2, 
        borderRadius: 2,
        width: '100%',
        height: '100%',
        overflowY: 'auto'
      }}
    >
      
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <Document
          file={pdfUrl} 
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<CircularProgress />}
        >

          <Page 
            pageNumber={pageNumber} 
            renderTextLayer={false} 
            renderAnnotationLayer={false}
            width={containerWidth || 400}
            // Bỏ prop scale đi, hoặc để scale={1} vì width đã kiểm soát kích thước rồi
          />
        </Document>
      </Box>

      {/* Thanh điều hướng trang giữ nguyên */}
      {numPages && (
        <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center', pb: 2 }}>
          <Button disabled={pageNumber <= 1} onClick={() => setPageNumber(p => p - 1)} variant="outlined" size="small">
            Trước
          </Button>
          <Typography variant="body2">
            {pageNumber} / {numPages}
          </Typography>
          <Button disabled={pageNumber >= numPages} onClick={() => setPageNumber(p => p + 1)} variant="outlined" size="small">
            Sau
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CVViewer;