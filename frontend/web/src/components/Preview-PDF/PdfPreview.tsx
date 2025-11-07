interface PdfPreviewProps {
  pdfUrl: string;
}

const PdfPreview: React.FC<PdfPreviewProps> = ({ pdfUrl }) => {

  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      overflow: 'hidden',
      background: '#f9f9f9',
    //   height: 'fit-content',
      position: 'relative',
    },
    loader: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      color: '#888',
    },
    iframe: {
      width: '100%',
      height: '100%',
      border: 'none',
      borderRadius: '8px',
    //   pointerEvents: 'none', 
    },
  };

  return (
    <div style={styles.container} className="h-full">
      {pdfUrl ? (
        <iframe
          src={`${pdfUrl}#toolbar=0`}
          title="Trình xem CV PDF (Xem trước)"
          style={styles.iframe}
        />
      ) : (
        <div style={styles.loader}>Không có file PDF để hiển thị.</div>
      )}
    </div>
  );
};

export default PdfPreview;

/* // --- CÁCH SỬ DỤNG ---
// (Trong component cha của bạn)
//
// const getPdfUrl = () => { ... (hàm xử lý logic lấy link) ... };
// const pdfUrl = getPdfUrl();
//
// return (
//   {pdfUrl ? (
//       <PdfPreview pdfUrl={pdfUrl} />
//   ) : (
//       <p>Không có file CV.</p>
//   )}
// )
*/