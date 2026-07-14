const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const uploadToCloudinary = async (
	file,
	folder = "aromus/products",
) => {
	if (!CLOUD_NAME || !UPLOAD_PRESET) throw new Error("Cloudinary frontend environment variables are missing.");
	if (!(file instanceof File) && !(file instanceof Blob)) throw new TypeError("Select a valid file to upload.");
	const formData = new FormData();
	formData.append("file", file);
	formData.append("upload_preset", UPLOAD_PRESET);

	formData.append("folder", folder);

	const res = await fetch(
		`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
		{
			method: "POST",
			body: formData,
		},
	);

	const data = await res.json().catch(() => ({}));
	if (!res.ok) throw new Error(data.error?.message || "Cloudinary upload failed.");

	return {
		url: data.secure_url,
		publicId: data.public_id,
		type: data.resource_type,
	};
};
