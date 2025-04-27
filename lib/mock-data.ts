import type { Client, ClientType, ClientStatus } from "@/types/client"

const clientNames = [
  "John Doe",
  "Jane Smith",
  "Robert Johnson",
  "Emily Davis",
  "Michael Brown",
  "Sarah Wilson",
  "David Taylor",
  "Lisa Anderson",
  "James Martinez",
  "Jennifer Thomas",
  "Acme Corp",
  "TechSolutions Inc",
  "Global Enterprises",
  "Innovative Systems",
  "Future Technologies",
  "Strategic Partners",
  "Dynamic Solutions",
  "Premier Services",
  "Elite Consulting",
  "Nexus Group",
]

const domains = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "company.com",
  "enterprise.org",
  "business.net",
  "tech.io",
  "solutions.co",
  "global.com",
]

const updatedByUsers = ["admin", "system", "hello world", "support", "manager"]

export function generateMockClients(count: number): Client[] {
  const clients: Client[] = []

  for (let i = 1; i <= count; i++) {
    const nameIndex = Math.floor(Math.random() * clientNames.length)
    const name = clientNames[nameIndex]
    const isCompany =
      name.includes(" Inc") ||
      name.includes(" Corp") ||
      name.includes(" Group") ||
      name.includes(" Partners") ||
      name.includes(" Solutions") ||
      name.includes(" Services") ||
      name.includes(" Technologies") ||
      name.includes(" Consulting") ||
      name.includes(" Systems") ||
      name.includes(" Enterprises")
    const type: ClientType = isCompany ? "Company" : "Individual"

    // Generate email based on name
    const emailName = name.toLowerCase().replace(/\s+/g, ".")
    const domainIndex = Math.floor(Math.random() * domains.length)
    const email = `${emailName}@${domains[domainIndex]}`

    // Random status
    const statuses: ClientStatus[] = ["Active", "Inactive", "Pending"]
    const statusIndex = Math.floor(Math.random() * statuses.length)
    const status = statuses[statusIndex]

    // Random dates within the last 2 years
    const now = new Date()
    const twoYearsAgo = new Date()
    twoYearsAgo.setFullYear(now.getFullYear() - 2)

    const createdAtTimestamp = twoYearsAgo.getTime() + Math.random() * (now.getTime() - twoYearsAgo.getTime())
    const createdAt = new Date(createdAtTimestamp)

    // Updated date is after created date
    const updatedAtTimestamp = createdAtTimestamp + Math.random() * (now.getTime() - createdAtTimestamp)
    const updatedAt = new Date(updatedAtTimestamp)

    // Random updated by user
    const updatedByIndex = Math.floor(Math.random() * updatedByUsers.length)
    const updatedBy = updatedByUsers[updatedByIndex]

    clients.push({
      id: i,
      name,
      type,
      email,
      status,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
      updatedBy,
    })
  }

  return clients
}
