import "./ViewModal.css";

const ViewModal = ({ job, onClose }: { job: any; onClose: () => void }) => {
  if (!job) return null;

  return (
    <div className="view-modal-overlay" onDoubleClick={onClose}>
      <div className="view-modal">

        <div className="view-modal-content">

          <div className="view-modal-head">
            <h2 className="view-modal-title" style={{ margin: 0 }}>{job.jobTitle}</h2>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>

          <div className="view-modal-body">
            {/* Company Info */}
            <div className="company-info">

              <div className="flex gap-5 items-center">
                <img src={job.department?.avatar} alt={job.department?.name} className="company-avatar" style={{margin: 0}}/>
                <div className="text-left">
                  <h3 className="font-bold">{job.department?.name}</h3>
                  <p><b>Địa chỉ:</b> {job.address}, {job.location}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="creator">
                  <img src={job.createBy?.avatar} alt={job.createBy?.fullname} />
                  <span>Đăng bởi: <b>{job.createBy?.fullname}</b></span>
                </div>
                <div className="job-date">
                  Ngày tạo: {new Date(job.createdAt).toLocaleDateString()}
                </div>
              </div>

            </div>

            {/* Job Detail */}
            <div className="job-info">
              <p className="job-info-item"><span className="label job-info-lable">Loại công việc:</span> {job.jobType}</p>
              <p className="job-info-item"><span className="label job-info-lable">Cấp bậc:</span> {job.jobLevel}</p>
              <p className="job-info-item"><span className="label job-info-lable">Lương:</span> {job.salary}</p>
              <p className="job-info-item"><span className="label job-info-lable">Số lượng tuyển:</span> {job.num}</p>
              <p className="job-info-item"><span className="label job-info-lable">Hạn nộp:</span> {new Date(job.endDate).toLocaleDateString()}</p>
            </div>

            {/* Description */}
            <div className="section job-description">
              <h4>Mô tả công việc</h4>
              <ul className="section-ul">
                {job.jobDescription?.map((desc: string, idx: number) => (
                  <li key={idx}>{desc}</li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div className="section">
              <h4>Yêu cầu</h4>
              <ul className="section-ul">
                {job.requirement?.map((req: string, idx: number) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </div>

            {/* Skills */}
            <div className="section">
              <h4>Kỹ năng</h4>
              <ul className="skills-list section-ul">
                {job.skills?.map((skill: string, idx: number) => (
                  <li key={idx}>{skill}</li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            {job.benefits?.length > 0 && (
              <div className="section">
                <h4>Quyền lợi</h4>
                <ul className="section-ul">
                  {job.benefits.map((benefit: string, idx: number) => (
                    <li key={idx}>{benefit}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Footer Info */}
            <div className="job-footer">
              <button className="btn-save-edit" onClick={() => {
                alert("hehehe")
              }}>
                Lưu chỉnh sửa
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ViewModal;
