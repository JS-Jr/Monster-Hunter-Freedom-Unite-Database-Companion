param(
    [Parameter(Mandatory=$true)]
    [string]$HtmlFilePath,
    [string]$OutputPath = ".\mhfu_items.json"
)

# Load HtmlAgilityPack
Add-Type -Path ((Get-ChildItem "$env:USERPROFILE" -Recurse -Filter HtmlAgilityPack.dll -ErrorAction SilentlyContinue | Select-Object -First 1).FullName)

$doc = New-Object HtmlAgilityPack.HtmlDocument
$doc.Load($HtmlFilePath)

$items = @()

# Select all <table> elements
$tables = $doc.DocumentNode.SelectNodes("//table")

foreach ($table in $tables) {
    # Find the nearest <h2> or <h3> above the table
    $headerNode = $table.SelectSingleNode("preceding-sibling::*[self::h2 or self::h3][1]")
    $header = if ($headerNode) { $headerNode.InnerText.Trim() } else { "Unknown" }

    # Get all rows except header
    $rows = $table.SelectNodes(".//tr[position()>1]")
    if (-not $rows) { continue }

    foreach ($row in $rows) {
        $cols = $row.SelectNodes(".//td")
        if ($cols.Count -lt 6) { continue }

        $item = [PSCustomObject]@{
            ItemType = $header
            ItemName = ($cols[1].InnerText.Trim() -replace '\s+', ' ')
            Rarity   = ($cols[2].InnerText.Trim())
            Capacity = ($cols[3].InnerText -replace '[xX]', '' -replace '\s+', '')
            Value    = ($cols[4].InnerText.Trim())
            HowToGet = ($cols[5].InnerText.Trim() -replace '\s+', ' ')
        }
        $items += $item
    }
}

$items | ConvertTo-Json -Depth 3 | Out-File $OutputPath -Encoding utf8
Write-Host "✅ Exported $($items.Count) items → $OutputPath"
