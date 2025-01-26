const useMock = false; // Toggle between mock and real API

export async function fetchPapers(query: string, offset: number, limit: number) {
	if (useMock) {
		// Mock Data
        // delay for 1 second to simulate network latency
        // await new Promise((resolve) => setTimeout(resolve, 3000));
		return Array.from({ length: limit }, (_, i) => {
			const index = offset + i + 1;
			return {
				title: `Mock Paper Title ${index}`,
				authors: `Author A${index}, Author B${index}`,
				year: 2023 - (index % 5),
				tldr: `This is a mock TL;DR for paper ${index}.`,
                pdfUrl: 'https://arxiv.org/pdf/2109.12345.pdf',
				overlay: true,
				id: `mock-${index}`,
			};
		});
	}

	// Real API call
	const url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(
		query
	)}&openAccessPdf&offset=${offset}&limit=${limit}&fields=title,year,authors,tldr,openAccessPdf`;

	const response = await fetch(url).catch((error) => {
		console.error('Error fetching papers:', error);
		return null;
	});
	if (!response) return [];
	const data = await response.json();

	return data.data.map((paper: any) => ({
		title: paper.title,
		authors: paper.authors.length > 15 ? `${paper.authors.slice(0,15).map((author: any) => author.name).join(', ')}, ...` : paper.authors.map((author: any) => author.name).join(', '),
		year: paper.year || 'Unknown Year',
		tldr: paper.tldr?.text,
        pdfUrl: paper.openAccessPdf.url,
		overlay: true,
		id: paper.paperId,
	}));
}
