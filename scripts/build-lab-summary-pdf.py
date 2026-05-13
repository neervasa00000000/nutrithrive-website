#!/usr/bin/env python3
"""Generate a short, readable NMI lab summary PDF (replaces documents/nutrithrive-lab-report-summary.pdf)."""
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "documents" / "nutrithrive-lab-report-summary.pdf"


def build():
    doc = SimpleDocTemplate(
        str(OUT),
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=16 * mm,
        bottomMargin=16 * mm,
        title="NutriThrive — Lab summary (NMI)",
    )
    styles = getSampleStyleSheet()
    title = ParagraphStyle(
        "T",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=16,
        textColor=colors.HexColor("#1a2e22"),
        spaceAfter=6,
    )
    sub = ParagraphStyle(
        "S",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#374151"),
    )
    small = ParagraphStyle(
        "Sm",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#6b7280"),
    )
    body = ParagraphStyle(
        "B",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=10,
        leading=13,
        textColor=colors.HexColor("#111827"),
    )

    story = []
    story.append(Paragraph("NutriThrive — Moringa powder lab summary", title))
    story.append(
        Paragraph(
            "<b>Tester:</b> National Measurement Institute (NMI), Australian Government<br/>"
            "<b>Report No.:</b> RN1453596 &nbsp;|&nbsp; <b>Batch:</b> NT042024<br/>"
            "<b>Sample received:</b> 10 Jan 2025 &nbsp;|&nbsp; <b>Analysis:</b> 17–21 Jan 2025<br/>"
            "<b>Report issued:</b> 24 Jan 2025 &nbsp;|&nbsp; <b>Product:</b> 100% Moringa oleifera leaf powder",
            sub,
        )
    )
    story.append(Spacer(1, 10))

    key_data = [
        ["Analyte / measure", "Result (per 100 g)", "Notes"],
        ["Protein", "29.0 g", "High for a leafy plant powder"],
        ["Total fat", "7.4 g", ""],
        ["Omega-3 (of total fat)", "44.6%", "ALA; strong plant omega-3"],
        ["Omega-6 (of total fat)", "9.4%", ""],
        ["Carbohydrates", "45 g", ""],
        ["Total sugars", "5.9 g", ""],
        ["Moisture", "8.1%", "Consistent with careful drying"],
        ["Ash (minerals)", "10.6 g", ""],
        ["Sodium", "78 mg", "Low"],
        ["Energy", "1530 kJ (~365 kcal)", ""],
    ]
    t1 = Table(key_data, colWidths=[58 * mm, 42 * mm, 72 * mm])
    t1.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#2d5a3d")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, 0), 9),
                ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
                ("FONTSIZE", (0, 1), (-1, -1), 9),
                ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#d1d5db")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ]
        )
    )
    story.append(t1)
    story.append(Spacer(1, 10))
    story.append(
        Paragraph(
            "<b>Additives / adulterants:</b> None detected in this certificate scope.<br/>"
            "Figures above are taken from the issued NMI report for batch NT042024. "
            "For full methodology and legal wording, retain the original certificate from NMI.",
            body,
        )
    )
    story.append(Spacer(1, 14))
    story.append(Paragraph("<b>Fatty acid profile (% of total fat)</b>", sub))
    fa_data = [
        ["Fatty acid", "% of total fat"],
        ["Alpha-linolenic acid (ALA, omega-3)", "44.6"],
        ["Linoleic acid (omega-6)", "9.4"],
        ["Oleic acid", "5.9"],
        ["Palmitic acid", "21.9"],
        ["Polyunsaturated (total)", "54.0"],
        ["Monounsaturated (total)", "6.9"],
        ["Saturated (total)", "39.1"],
    ]
    t2 = Table(fa_data, colWidths=[100 * mm, 35 * mm])
    t2.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#e5e7eb")),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, 0), 9),
                ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
                ("FONTSIZE", (0, 1), (-1, -1), 9),
                ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#d1d5db")),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]
        )
    )
    story.append(t2)
    story.append(Spacer(1, 12))
    story.append(
        Paragraph(
            "<b>NutriThrive</b> — 15 Europe Street, Truganina VIC 3029, Australia<br/>"
            "Phone: 0438 201 419 &nbsp;|&nbsp; Email: nutrithrive0@gmail.com &nbsp;|&nbsp; Web: nutrithrive.com.au",
            sub,
        )
    )
    story.append(Spacer(1, 8))
    story.append(
        Paragraph(
            "This PDF is a customer-friendly summary produced by NutriThrive. "
            "It is not a substitute for the official NMI certificate. "
            "Nutritional supplements are not a replacement for a varied diet or medical care.",
            small,
        )
    )
    doc.build(story)


if __name__ == "__main__":
    build()
    print("Wrote", OUT)
