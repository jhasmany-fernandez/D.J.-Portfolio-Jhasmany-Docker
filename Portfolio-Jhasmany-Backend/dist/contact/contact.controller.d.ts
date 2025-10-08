import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
export declare class ContactController {
    private readonly contactService;
    constructor(contactService: ContactService);
    create(createContactDto: CreateContactDto): Promise<import("./entities/contact.entity").Contact>;
    findAll(): Promise<import("./entities/contact.entity").Contact[]>;
    getUnreadCount(): Promise<number>;
    findOne(id: string): Promise<import("./entities/contact.entity").Contact>;
    markAsRead(id: string): Promise<import("./entities/contact.entity").Contact>;
    markAsReplied(id: string): Promise<import("./entities/contact.entity").Contact>;
    remove(id: string): Promise<void>;
}
