const mongoose = require('mongoose');
const slugify = require('slugify');

const cisrEventSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    date: {
        type: Date,
        required: true,
        index: true
    },
    coverImage: {
        type: String,
        required: true,
        trim: true
    },
    images: {
        type: [String],
        required: true,
        validate: {
            validator: function (val) {
                return val.length > 0;
            },
            message: 'At least one image is required'
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Compound index for common queries
cisrEventSchema.index({ date: -1, slug: 1 });

// Pre-save hook to auto-generate slug from title
cisrEventSchema.pre('save', async function (next) {
    // Only generate slug if title is modified or it's a new document
    if (this.isModified('title') || this.isNew) {
        let baseSlug = slugify(this.title, {
            lower: true,
            strict: true,
            remove: /[*+~.()'"!:@]/g
        });

        let slug = baseSlug;
        let counter = 1;

        // Ensure slug uniqueness
        while (await this.constructor.findOne({ slug, _id: { $ne: this._id } })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        this.slug = slug;
    }
    next();
});

// Static method to find by slug
cisrEventSchema.statics.findBySlug = function (slug, lean = true) {
    const query = this.findOne({ slug });
    return lean ? query.lean() : query;
};

// Static method to find upcoming CISR events
cisrEventSchema.statics.findUpcoming = function (limit = 10) {
    return this.find({ date: { $gte: new Date() } })
        .sort({ date: 1 })
        .limit(limit)
        .lean();
};

// Static method to find CISR events by date range
cisrEventSchema.statics.findByDateRange = function (startDate, endDate) {
    return this.find({
        date: {
            $gte: startDate,
            $lte: endDate
        }
    })
        .sort({ date: -1 })
        .lean();
};

// Instance method to check if event is upcoming
cisrEventSchema.methods.isUpcoming = function () {
    return this.date >= new Date();
};

// Virtual for formatted date
cisrEventSchema.virtual('formattedDate').get(function () {
    return this.date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
});

module.exports = mongoose.model('CisrEvent', cisrEventSchema);
