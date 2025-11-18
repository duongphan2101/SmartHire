import { useEffect, useState } from 'react';
import { Avatar, Divider, List, Skeleton } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import type { ApplicationResponse } from '../../hook/useApplication';
import defaultAVT from "../../assets/images/logo_v1.png";

interface DataTypeProps {
    dataList: ApplicationResponse[];
    onSelect?: (item: ApplicationResponse) => void;
}

const ListCandidate = ({ dataList, onSelect }: DataTypeProps) => {
    const [displayedData, setDisplayedData] = useState<ApplicationResponse[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const BATCH_SIZE = 10;

    const cssStyles = `
        .candidate-item-hover {
            transition: all 0.3s;
            border: 1px solid transparent; /* Border tàng hình để tránh giật layout */
        }
        .candidate-item-hover:hover {
            background-color: #e6f7ff; /* Màu nền khi hover */
            border: 1px solid #1890ff; /* Viền khi hover */
        }
        /* Đổi màu title khi hover vào dòng cha */
        .candidate-item-hover:hover .candidate-name {
            color: #1890ff !important;
        }
        /* Đổi border avatar khi hover vào dòng cha */
        .candidate-item-hover:hover .ant-avatar {
            border: 2px solid #1890ff !important;
        }
    `;

    useEffect(() => {
        if (dataList && dataList.length > 0) {
            setDisplayedData(dataList.slice(0, BATCH_SIZE));
            setHasMore(dataList.length > BATCH_SIZE);
        } else {
            setDisplayedData([]);
            setHasMore(false);
        }
    }, [dataList]);

    const loadMoreData = () => {
        if (displayedData.length >= dataList.length) {
            setHasMore(false);
            return;
        }
        setTimeout(() => {
            const currentLength = displayedData.length;
            const nextData = dataList.slice(currentLength, currentLength + BATCH_SIZE);
            setDisplayedData([...displayedData, ...nextData]);
            if (currentLength + BATCH_SIZE >= dataList.length) {
                setHasMore(false);
            }
        }, 500);
    };

    const handleItemClick = (item: ApplicationResponse) => {
        if (onSelect) {
            onSelect(item);
        }
    };

    const statusColors: Record<string, { bg: string; color: string; border: string; label: string }> = {
        pending: { bg: '#fff7e6', color: '#fa8c16', border: '#ffd591', label: 'Chờ duyệt' },
        reviewed: { bg: '#e6f7ff', color: '#1890ff', border: '#91d5ff', label: 'Đã xem' },
        contacted: { bg: '#f9f0ff', color: '#722ed1', border: '#d3adf7', label: 'Đã liên hệ' },
        accepted: { bg: '#f6ffed', color: '#52c41a', border: '#b7eb8f', label: 'Đã nhận' },
        rejected: { bg: '#fff1f0', color: '#f5222d', border: '#ffa39e', label: 'Từ chối' },
    };

    const stripHtmlToText = (html: string) => {
        if (!html) return "Không có nội dung";
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    };

    return (
        <>
            <style>{cssStyles}</style>

            <div
                id="scrollableDiv"
                style={{
                    height: 'auto',
                    overflow: 'auto',
                    padding: '0 16px',
                    borderRadius: '8px'
                }}
            >
                <InfiniteScroll
                    dataLength={displayedData.length}
                    next={loadMoreData}
                    hasMore={hasMore}
                    loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                    endMessage={<Divider plain>Đã hiển thị hết danh sách 🤐</Divider>}
                    scrollableTarget="scrollableDiv"
                >
                    <List
                        dataSource={displayedData}
                        renderItem={(item) => {
                            const statusConfig = statusColors[item.status] || statusColors.pending;
                            return (
                                <List.Item
                                    key={item._id}
                                    onClick={() => handleItemClick(item)}
                                    style={{
                                        cursor: 'pointer',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        marginBottom: '8px',
                                    }}
                                    className="candidate-item-hover"
                                >
                                    <List.Item.Meta
                                        avatar={
                                            <Avatar
                                                src={item.userSnapshot?.avatar || defaultAVT}
                                                size="large"
                                            />
                                        }
                                        title={
                                            <div className="flex flex-col">
                                                <span
                                                    className="candidate-name"
                                                    style={{
                                                        fontWeight: 'bold',
                                                        fontSize: '16px',
                                                        transition: 'color 0.3s'
                                                    }}
                                                >
                                                    {item.userSnapshot?.fullname || "Unknown Candidate"}
                                                </span>
                                                <span style={{ fontSize: '16px', color: '#888', fontWeight: 'bold' }}>
                                                    Ứng tuyển cho: {item.jobSnapshot?.title}
                                                </span>
                                            </div>
                                        }
                                        description={
                                            <div style={{ marginTop: '4px' }}>
                                                <p style={{
                                                    margin: 0,
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    maxWidth: '350px',
                                                    color: '#666',
                                                    fontSize: '14px'
                                                }}>
                                                    {stripHtmlToText(item.coverLetter ?? "")}
                                                </p>
                                            </div>
                                        }
                                    />
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                        <span style={{ fontSize: '12px', color: '#aaa' }}>
                                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                                        </span>
                                        <div
                                            style={{
                                                marginTop: 8,
                                                padding: '2px 8px',
                                                borderRadius: '4px',
                                                fontSize: '11px',
                                                fontWeight: 500,
                                                background: statusConfig.bg,
                                                color: statusConfig.color,
                                                border: `1px solid ${statusConfig.border}`,
                                            }}
                                        >
                                            {statusConfig.label}
                                        </div>
                                    </div>
                                </List.Item>
                            );
                        }}
                    />
                </InfiniteScroll>
            </div>
        </>
    );
};

export default ListCandidate;