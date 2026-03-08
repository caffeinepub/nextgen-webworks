import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ContactMessage {
    id: string;
    owner: Principal;
    name: string;
    email: string;
    message: string;
    timestamp: Time;
}
export type Time = bigint;
export interface Contact {
    id: string;
    owner: Principal;
    name: string;
    email: string;
    message: string;
    timestamp: Time;
}
export type ServiceDetail = {
    __kind__: "enum";
    enum: string;
} | {
    __kind__: "name";
    name: string;
};
export interface Project {
    id: string;
    serviceType: ServiceType;
    country: string;
    featuresRequired: Array<string>;
    serviceDetails: Array<ServiceDetail>;
    owner: Principal;
    designStyle: DesignStyle;
    name: string;
    businessName: string;
    businessType: BusinessType;
    email: string;
    timestamp: Time;
    budgetRange: BudgetRange;
}
export interface ProjectRequest {
    id: string;
    serviceType: ServiceType;
    country: string;
    featuresRequired: Array<string>;
    serviceDetails: Array<ServiceDetail>;
    owner: Principal;
    designStyle: DesignStyle;
    name: string;
    businessName: string;
    businessType: BusinessType;
    email: string;
    timestamp: Time;
    budgetRange: BudgetRange;
}
export enum BudgetRange {
    low = "low",
    high = "high",
    medium = "medium"
}
export enum BusinessType {
    enterprise = "enterprise",
    startup = "startup",
    nonProfit = "nonProfit",
    smallBusiness = "smallBusiness",
    individual = "individual"
}
export enum DesignStyle {
    classic = "classic",
    playful = "playful",
    professional = "professional",
    minimalist = "minimalist",
    modern = "modern"
}
export enum ServiceType {
    graphicDesign = "graphicDesign",
    other = "other",
    consulting = "consulting",
    webDevelopment = "webDevelopment",
    branding = "branding"
}
export interface backendInterface {
    getAllContactMessages(): Promise<Array<Contact>>;
    getAllProjectRequests(): Promise<Array<Project>>;
    submitContactMessage(message: ContactMessage): Promise<void>;
    submitProjectRequest(request: ProjectRequest): Promise<void>;
}
