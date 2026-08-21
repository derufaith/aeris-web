import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { scores } = body;

    if (!scores || !Array.isArray(scores)) {
      return NextResponse.json(
        {
          error: "Data screening tidak valid.",
        },
        { status: 400 }
      );
    }

    const totalScore = scores.reduce(
      (total: number, score: number) => total + score,
      0
    );

    const maxScore = scores.length * 4;

    const percentage = Math.round(
      (totalScore / maxScore) * 100
    );

    let status = "Good";
    let insight =
      "Hasil screening menunjukkan kondisi secara umum cukup baik.";

    if (percentage < 60) {
      status = "Needs Attention";
      insight =
        "Beberapa aspek mungkin membutuhkan perhatian lebih lanjut.";
    }

    if (percentage < 40) {
      status = "Further Attention";
      insight =
        "Beberapa aspek menunjukkan perlunya perhatian dan tindak lanjut.";
    }

    return NextResponse.json({
      success: true,
      result: {
        score: totalScore,
        maxScore,
        percentage,
        status,
        insight,
      },
    });
  } catch {
    return NextResponse.json(
      {
        error: "Terjadi kesalahan saat menganalisis data.",
      },
      { status: 500 }
    );
  }
}