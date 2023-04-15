import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';

interface IMedicalRecords {
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
@Component({
  selector: 'uni-doc',
  templateUrl: 'document.component.html',
  styleUrls: ['document.component.scss', '../../common.style.scss'],
})
export class DocumentComponent implements OnInit {
  paitentProfile$ = this.profileService.current;

  readonly maxLetter = 400;

  recs: IMedicalRecords[] = [
    {
      title: 'Random Medical History',
      createdAt: new Date(Date.now() + 3247293847),
      updatedAt: new Date(),
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione, corrupti quaerat ut voluptatem molestias in, odio nesciunt repellat tempore consequatur a quae expedita quis dolorum quibusdam eum! Explicabo, sapiente harum.',
    },
    {
      title: 'Random Medical History 2',
      createdAt: new Date(Date.now() + 7372847),
      updatedAt: new Date(),
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione, corrupti quaerat ut voluptatem molestias in, odio nesciunt repellat tempore consequatur a quae expedita quis dolorum quibusdam eum! Explicabo, sapiente harum.',
    },
    {
      title: 'Random Medical History 3',
      createdAt: new Date(Date.now() + 324235),
      updatedAt: new Date(),
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione, corrupti quaerat ut voluptatem molestias in, odio nesciunt repellat tempore consequatur a quae expedita quis dolorum quibusdam eum! Explicabo, sapiente harum.',
    },
  ];

  constructor(private profileService: ProfileService) { }

  ngOnInit() { }
}
