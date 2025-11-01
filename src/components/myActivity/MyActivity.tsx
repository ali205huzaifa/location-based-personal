// import React, { useState } from "react";
// import { Input, Avatar, Button } from "antd";
// import { SearchOutlined } from "@ant-design/icons";


// interface MapCardProps {
//   image: string;
//   caption: string;
//   location?: string;
//   likes: number;
//   comments: number;
//   shares: number;
//   onClick: () => void;
//   username: string;
// }

// const MyActivity: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<"posts" | "interactions">("posts");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedPost, setSelectedPost] = useState<any>(null);
//   const [isShareOpen, setIsShareOpen] = useState(false);
//   const [popupPostId, setPopupPostId] = useState<number | null>(null);

//   const posts = [
//     {
//       id: 1,
//       image: "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?w=800",
//       caption: "Street musician absolutely killing it 🎸",
//       likes: 129,
//       comments: 80,
//       shares: 29,
//       location: "Pier 39, San Francisco, CA",
//       username: "@alexcos45",
//       top: "320px",
//       left: "410px",
//     },
//     {
//       id: 2,
//       image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
//       caption: "Beachside vibes 🌊",
//       likes: 212,
//       comments: 64,
//       shares: 41,
//       location: "Miami Beach, FL",
//       username: "@alexcos45",
//       top: "500px",
//       left: "260px",
//     },
//     {
//       id: 3,
//       image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/2018_Toyota_Corolla_%28ZRE172R%29_Ascent_sedan_%282018-10-12%29_01.jpg/640px-2018_Toyota_Corolla_%28ZRE172R%29_Ascent_sedan_%282018-10-12%29_01.jpg",
//       caption: "Car parked perfectly 🚗",
//       likes: 89,
//       comments: 34,
//       shares: 12,
//       location: "Denver, CO",
//       username: "@alexcos45",
//       top: "390px",
//       left: "500px",
//     },
//   ];

//   const MapCard: React.FC<MapCardProps> = ({
//     image,
//     caption,
//     likes,
//     comments,
//     shares,
//     location,
//     onClick,
//   }) => (
//     <div
//       onClick={onClick}
//       className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition border border-gray-100 p-2"
//     >
//       <img
//         src={image}
//         alt="map post"
//         className="object-cover h-44 w-full rounded-xl"
//       />
//       <div className="pt-4 pb-2">
//         <div className="flex items-start justify-start text-gray-600 text-sm mb-1 gap-3">
//           <span className="flex items-center">❤️ {likes}</span>
//           <span className="flex items-center">💬 {comments}</span>
//           <span className="flex items-center">🔄 {shares}</span>
//         </div>
//         <p className="text-[#000000] text-sm font-normal">{caption}</p>
//         <p className="text-stone-500 text-xs font-normal mt-2 flex items-center">
//           📍 {location}
//         </p>
//       </div>
//     </div>
//   );

//   const handleAvatarClick = (id: number) => {
//     setPopupPostId(id);
//   };

//   const handleClosePopup = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     setPopupPostId(null);
//   };

//   const handlePostClick = (post: any) => {
//     setSelectedPost(post);
//     setIsModalOpen(true);
//   };

//   const handleModalClose = () => {
//     setIsModalOpen(false);
//     setSelectedPost(null);
//   };

//   return (
//     <div className="flex flex-col bg-[#F9FAFB] min-h-screen">
//       {/* Profile Header */}
//       <div className="flex items-center gap-6 px-10 py-6 bg-white shadow-sm border-b">
//         <Avatar
//           size={80}
//           src="https://randomuser.me/api/portraits/men/45.jpg"
//         />
//         <div>
//           <h2 className="text-xl font-semibold text-gray-800">Alex Costa</h2>
//           <p className="text-gray-500 text-sm">@alexcos45</p>
//           <div className="flex items-center gap-6 mt-2 text-sm text-gray-600">
//             <span>
//               <strong>08</strong> Circles Joined
//             </span>
//             <span>
//               <strong>18</strong> Circle Size
//             </span>
//           </div>
//           <p className="text-gray-500 text-sm mt-1">
//             Digital creator ✦ NYC | Sharing moments, not just posts ✦
//           </p>
//         </div>
//         <div className="ml-auto">
//           <Button
//             type="primary"
//             className="rounded-full px-6 bg-[#836FFF] hover:bg-[#6c5ce7] text-white border-none"
//           >
//             Edit Profile
//           </Button>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="flex justify-center items-center gap-3 mt-4">
//         <Button
//           type={activeTab === "posts" ? "primary" : "default"}
//           onClick={() => setActiveTab("posts")}
//           className={`rounded-full px-6 ${
//             activeTab === "posts"
//               ? "bg-[#836FFF] text-white border-none"
//               : "bg-white text-gray-600 border-gray-200"
//           }`}
//         >
//           My Posts
//         </Button>
//         <Button
//           type={activeTab === "interactions" ? "primary" : "default"}
//           onClick={() => setActiveTab("interactions")}
//           className={`rounded-full px-6 ${
//             activeTab === "interactions"
//               ? "bg-[#836FFF] text-white border-none"
//               : "bg-white text-gray-600 border-gray-200"
//           }`}
//         >
//           My Interactions
//         </Button>
//       </div>

//       {/* Main Content */}
//       <div className="flex gap-4 flex-1 mt-4">
//         {/* Map Section */}
//         <div className="flex-1 flex flex-col relative">
//           <div className="flex justify-center py-4">
//             <Input
//               prefix={<SearchOutlined />}
//               placeholder="Search by name or email"
//               allowClear
//               className="!h-10 !text-sm !w-[300px]"
//             />
//           </div>
//           <div className="relative w-full h-[850px] rounded-lg overflow-hidden">
//             <iframe
//               title="map"
//               width="100%"
//               height="100%"
//               className="border-none"
//               src="https://www.openstreetmap.org/export/embed.html?bbox=-105.0%2C39.7%2C-104.9%2C39.8&amp;layer=mapnik"
//             ></iframe>

//             {posts.map((post) => (
//               <div
//                 key={post.id}
//                 className="absolute cursor-pointer"
//                 style={{ top: post.top, left: post.left }}
//                 onClick={() => handleAvatarClick(post.id)}
//               >
//                 <Avatar
//                   size={50}
//                   src={post.image}
//                   className="border-2 border-white shadow-md"
//                 />
//                 {popupPostId === post.id && (
//                   <div
//                     className="absolute z-50"
//                     style={{
//                       bottom: "70px",
//                       left: "-90px",
//                       width: "250px",
//                     }}
//                   >
//                     <div
//                       className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 after:absolute after:left-1/2 after:translate-x-[-50%] after:bottom-[-8px] after:w-4 after:h-4 after:bg-white after:rotate-45 after:shadow-md"
//                       onClick={(e) => e.stopPropagation()}
//                     >
//                       <button
//                         onClick={handleClosePopup}
//                         className="absolute top-1.5 right-1.5 bg-white rounded-full text-gray-600 hover:text-black shadow-sm w-5 h-5 flex items-center justify-center z-10"
//                       >
//                         ×
//                       </button>
//                       <MapCard {...post} onClick={() => {}} username={post.username} />
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))}

//             {/* Zoom Buttons */}
//             <div className="absolute bottom-6 right-6 flex flex-col space-y-2">
//               <button className="bg-white w-9 h-9 flex items-center justify-center rounded-md shadow text-lg">
//                 +
//               </button>
//               <button className="bg-white w-9 h-9 flex items-center justify-center rounded-md shadow text-lg">
//                 −
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Sidebar */}
//         <div className="w-80 h-[920px] mr-8 overflow-y-auto bg-[#F9FAFB] p-4 space-y-4 border-l border-gray-200">
//           {posts.map((post) => (
//             <MapCard
//               key={post.id}
//               {...post}
//               onClick={() => handlePostClick(post)}
//               username={post.username}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Modals */}
//       {/* <PostModal
//         visible={isModalOpen}
//         onClose={handleModalClose}
//         post={selectedPost}
//       />
//       <SharePostModal
//         visible={isShareOpen}
//         onClose={() => setIsShareOpen(false)}
//       /> */}
//     </div>
//   );
// };

// export default MyActivity;
