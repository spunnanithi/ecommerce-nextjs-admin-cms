import React from "react";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="h-full flex justify-center items-center">{children}</div>
	);
};

export default AdminLayout;
