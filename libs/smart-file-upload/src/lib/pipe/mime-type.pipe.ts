import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mimeType',
  standalone: true,
})
export class MimeTypePipe implements PipeTransform {
  private mimeDescriptions: { [key: string]: string } = {
    'image/jpeg': 'JPEG',
    'image/png': 'PNG',
    'image/gif': 'GIF',
    'image/webp': 'WEBP',
    'image/svg+xml': 'SVG',
    'application/pdf': 'PDF',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      'DOCX',
    'application/msword': 'DOC',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
    'application/vnd.ms-excel': 'XLS',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation':
      'PPTX',
    'application/vnd.ms-powerpoint': 'PPT',
    'application/zip': 'ZIP',
    'application/x-rar-compressed': 'RAR',
    'text/plain': 'Text',
    'text/csv': 'CSV',
    'audio/mpeg': 'MP3',
    'audio/wav': 'WAV',
    'video/mp4': 'MP4',
    'video/x-msvideo': 'AVI',
    'video/webm': 'WEBM',
  };

  private generalCategories: { [key: string]: string } = {
    'image/*': 'Images',
    'application/*': 'Documents',
    'audio/*': 'Audio Files',
    'video/*': 'Video Files',
    'text/*': 'Text Files',
  };

  private cache = new Map<string, string>(); // Cache for previously processed MIME types

  transform(mimeTypes: string): string {
    if (this.cache.has(mimeTypes)) {
      const cachedResult = this.cache.get(mimeTypes);
      if (cachedResult !== undefined) {
        return cachedResult;
      }
    }

    const typesArray = mimeTypes.split(',').map((type) => type.trim());
    const resultSet: Set<string> = new Set();

    typesArray.forEach((type) => {
      if (this.generalCategories[type]) {
        resultSet.add(this.generalCategories[type]);
      } else if (this.mimeDescriptions[type]) {
        resultSet.add(this.mimeDescriptions[type]);
      } else {
        const generalType = this.matchWildcard(type);
        if (generalType) {
          resultSet.add(generalType);
        } else {
          resultSet.add('Unknown File Type');
        }
      }
    });

    const result = `(${Array.from(resultSet).join(', ')})`;
    this.cache.set(mimeTypes, result); // Cache the result for future use

    return result;
  }

  // Check if a MIME type matches a general wildcard type (e.g., image/*)
  private matchWildcard(type: string): string | null {
    const typePrefix = type.split('/')[0] + '/*';
    return this.generalCategories[typePrefix] || null;
  }
}
