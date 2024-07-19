import Airtable from 'airtable';

class AirtableService {
  private base: Airtable.Base;

  constructor(apiKey: string, baseId: string) {
    Airtable.configure({
      apiKey: apiKey,
    });
    this.base = Airtable.base(baseId);
  }

  async getSubCodeCampaigns(userEmail: string): Promise<string[]> {
    try {
      const records = await this.base('Recruitment flow').select({
        view: 'Agent - Screening Interview',
        filterByFormula: `{Email (from Candidate)} = '${userEmail}'`,
        fields: ['Sub code Campaign (from Campaign)'],
      }).all();

      const subCodes = records.map(record => record.get('Sub code Campaign (from Campaign)') as string);
      
      // Remove duplicates and filter out falsy values
      return Array.from(new Set(subCodes)).filter(Boolean);
    } catch (error) {
      console.error('Error fetching sub code campaigns:', error);
      throw new Error('Failed to fetch sub code campaigns');
    }
  }

  async getCandidateByEmail(email: string): Promise<any | null> {
    try {
      const records = await this.base('Recruitment flow').select({
        view: 'Agent - Screening Interview',
        filterByFormula: `{Email (from Candidate)} = '${email}'`,
        maxRecords: 1,
      }).firstPage();

      if (records.length > 0) {
        return records[0].fields;
      }
      return null;
    } catch (error) {
      console.error('Error fetching candidate by email:', error);
      throw new Error('Failed to fetch candidate information');
    }
  }
}

export default AirtableService;