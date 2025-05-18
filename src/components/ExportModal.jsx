"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Download, Copy, Check, Printer } from "lucide-react"

export default function ExportModal({ isOpen, onClose, itineraryData, startDate }) {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("json")

  const handleCopyToClipboard = () => {
    const textToCopy =
      activeTab === "json" ? JSON.stringify(itineraryData, null, 2) : generateTextFormat(itineraryData, startDate)

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleDownload = () => {
    const content =
      activeTab === "json" ? JSON.stringify(itineraryData, null, 2) : generateTextFormat(itineraryData, startDate)

    const fileType = activeTab === "json" ? "json" : "txt"
    const fileName = `itinerary.${fileType}`

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handlePrint = () => {
    const printContent = generatePrintFormat(itineraryData, startDate)

    const printWindow = window.open("", "_blank")
    printWindow.document.write(`
      <html>
        <head>
          <title>Travel Itinerary</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            h1 {
              text-align: center;
              color: #2563eb;
              margin-bottom: 10px;
            }
            h2 {
              color: #2563eb;
              border-bottom: 1px solid #e5e7eb;
              padding-bottom: 5px;
              margin-top: 30px;
            }
            .date {
              color: #6b7280;
              font-size: 0.9em;
              margin-bottom: 20px;
              text-align: center;
            }
            .activity {
              margin-bottom: 20px;
              padding-left: 15px;
              border-left: 3px solid #e5e7eb;
            }
            .activity-title {
              font-weight: bold;
              font-size: 1.1em;
              margin-bottom: 5px;
            }
            .activity-meta {
              color: #6b7280;
              font-size: 0.9em;
              margin-bottom: 5px;
            }
            .activity-notes {
              font-style: italic;
              color: #6b7280;
            }
            .priority-high {
              border-left-color: #ef4444;
            }
            .priority-medium {
              border-left-color: #f59e0b;
            }
            .priority-low {
              border-left-color: #3b82f6;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              color: #6b7280;
              font-size: 0.8em;
            }
            @media print {
              body {
                padding: 0;
              }
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          ${printContent}
          <div class="footer">
            Generated on ${new Date().toLocaleDateString()} with Travel Itinerary Planner
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 500);
            };
          </script>
        </body>
      </html>
    `)
  }

  const generateTextFormat = (data, startDate) => {
    let text = "TRAVEL ITINERARY\n\n"

    if (startDate) {
      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + data.length - 1)
      text += `Trip Dates: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}\n\n`
    }

    data.forEach((day, index) => {
      text += `${day.title.toUpperCase()}\n`
      text += "=".repeat(day.title.length) + "\n"

      if (startDate) {
        const dayDate = new Date(startDate)
        dayDate.setDate(dayDate.getDate() + index)
        text += `Date: ${dayDate.toLocaleDateString()}\n`
      }

      text += "\n"

      if (day.activities.length === 0) {
        text += "No activities planned.\n\n"
      } else {
        day.activities.forEach((activity) => {
          text += `• ${activity.title}\n`
          if (activity.time) text += `  Time: ${activity.time}\n`
          if (activity.duration)
            text += `  Duration: ${Math.floor(activity.duration / 60)}h ${activity.duration % 60}m\n`
          if (activity.location) text += `  Location: ${activity.location}\n`
          if (activity.category) text += `  Category: ${activity.category}\n`
          if (activity.priority) text += `  Priority: ${activity.priority}\n`
          if (activity.cost) text += `  Cost: $${Number.parseFloat(activity.cost).toFixed(2)}\n`
          if (activity.notes) text += `  Notes: ${activity.notes}\n`
          text += "\n"
        })
      }

      text += "\n"
    })

    return text
  }

  const generatePrintFormat = (data, startDate) => {
    let html = `<h1>Travel Itinerary</h1>`

    if (startDate) {
      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + data.length - 1)
      html += `<div class="date">${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}</div>`
    }

    data.forEach((day, index) => {
      html += `<h2>${day.title}</h2>`

      if (startDate) {
        const dayDate = new Date(startDate)
        dayDate.setDate(dayDate.getDate() + index)
        html += `<div class="date">${dayDate.toLocaleDateString()}</div>`
      }

      if (day.activities.length === 0) {
        html += `<p>No activities planned.</p>`
      } else {
        day.activities.forEach((activity) => {
          const priorityClass = activity.priority ? `priority-${activity.priority}` : ""

          html += `<div class="activity ${priorityClass}">`
          html += `<div class="activity-title">${activity.title}</div>`

          const meta = []
          if (activity.time) meta.push(`Time: ${activity.time}`)
          if (activity.duration)
            meta.push(
              `Duration: ${Math.floor(activity.duration / 60)}h ${activity.duration % 60 > 0 ? `${activity.duration % 60}m` : ""}`,
            )
          if (activity.location) meta.push(`Location: ${activity.location}`)
          if (activity.category) meta.push(`Category: ${activity.category}`)
          if (activity.cost) meta.push(`Cost: $${Number.parseFloat(activity.cost).toFixed(2)}`)

          if (meta.length > 0) {
            html += `<div class="activity-meta">${meta.join(" • ")}</div>`
          }

          if (activity.notes) {
            html += `<div class="activity-notes">${activity.notes}</div>`
          }

          html += `</div>`
        })
      }
    })

    return html
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="dark:text-gray-100">Export Itinerary</DialogTitle>
          <DialogDescription className="dark:text-gray-300">
            Export your travel itinerary in different formats
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="json" className="mt-4" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="json">JSON Format</TabsTrigger>
            <TabsTrigger value="text">Text Format</TabsTrigger>
            <TabsTrigger value="print">Print View</TabsTrigger>
          </TabsList>

          <TabsContent value="json" className="mt-4">
            <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-auto max-h-[300px]">
              <pre className="text-sm dark:text-gray-300">{JSON.stringify(itineraryData, null, 2)}</pre>
            </div>
          </TabsContent>

          <TabsContent value="text" className="mt-4">
            <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-auto max-h-[300px] whitespace-pre-wrap">
              <pre className="dark:text-gray-300">{generateTextFormat(itineraryData, startDate)}</pre>
            </div>
          </TabsContent>

          <TabsContent value="print" className="mt-4">
            <div className="bg-white dark:bg-gray-900 p-4 rounded-md overflow-auto max-h-[300px] border dark:border-gray-700">
              <div
                dangerouslySetInnerHTML={{ __html: generatePrintFormat(itineraryData, startDate) }}
                className="dark:text-gray-300"
              />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4 sm:gap-0">
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              className="flex items-center gap-2 flex-1 sm:flex-auto dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
              onClick={handleCopyToClipboard}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </Button>

            {activeTab === "print" && (
              <Button
                variant="outline"
                className="flex items-center gap-2 flex-1 sm:flex-auto dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
                onClick={handlePrint}
              >
                <Printer className="h-4 w-4" />
                Print
              </Button>
            )}
          </div>

          <Button
            onClick={handleDownload}
            className="flex items-center gap-2 w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
