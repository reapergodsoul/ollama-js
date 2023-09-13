import fetch from "node-fetch";
import type { Response } from "node-fetch";
import type { ErrorResponse } from "./interfaces.js";

export const formatAddress = (address: string): string => {
	if (!address.startsWith("http://") && !address.startsWith("https://")) {
		address = `http://${address}`
	}

	while (address.endsWith("/")) {
		address = address.substring(0, address.length - 1);
	}

	return address;
};

const checkOk = async (response: Response): Promise<void> => {
	if (!response.ok) {
		let message: string;

		try {
			message = (await response.json() as ErrorResponse).error;
		} catch(error) {
			message = await response.text();
		}

		throw new Error(message);
	}
}

export const get = async (address: string): Promise<Response> => {
	const response = await fetch(formatAddress(address));

	await checkOk(response);

	return response;
};

export const post = async (address: string, data?: Record<string, unknown>): Promise<Response> => {
	const response = await fetch(formatAddress(address), {
		method: "POST",
		body: JSON.stringify(data)
	});

	await checkOk(response);

	return response;
};
